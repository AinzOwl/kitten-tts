#!/usr/bin/env python3
import sys
import json
import base64
import io
import tempfile
import os

def install_kittentts(silent=False):
    """Install KittenTTS if not already installed"""
    try:
        # First check if KittenTTS is already available
        import kittentts
        import soundfile
        if not silent:
            print(json.dumps({"status": "KittenTTS already available"}))
        return True
    except ImportError as missing_module:
        try:
            import subprocess
            import sys
            
            # Check what's missing and install accordingly
            missing_kittentts = False
            missing_soundfile = False
            
            try:
                import kittentts
            except ImportError:
                missing_kittentts = True
            
            try:
                import soundfile
            except ImportError:
                missing_soundfile = True
            
            if missing_kittentts:
                if not silent:
                    print(json.dumps({"status": "Installing KittenTTS wheel..."}))
                wheel_url = "https://github.com/KittenML/KittenTTS/releases/download/0.1/kittentts-0.1.0-py3-none-any.whl"
                # pip will check if package is already installed and skip if present
                subprocess.check_call([sys.executable, "-m", "pip", "install", wheel_url])
            
            if missing_soundfile:
                if not silent:
                    print(json.dumps({"status": "Installing soundfile..."}))
                subprocess.check_call([sys.executable, "-m", "pip", "install", "soundfile"])
            
            # Verify installation
            import kittentts
            import soundfile
            if not silent:
                print(json.dumps({"status": "Installation completed successfully"}))
            return True
            
        except Exception as e:
            print(json.dumps({"error": f"Failed to install KittenTTS: {str(e)}"}))
            return False

def check_installation():
    """Check if KittenTTS is properly installed"""
    try:
        from kittentts import KittenTTS
        import soundfile as sf
        return True
    except ImportError as e:
        return False

def generate_tts(config):
    """Generate TTS audio"""
    try:
        # Ensure KittenTTS is installed (silent mode to avoid mixing output)
        if not install_kittentts(silent=True):
            return {"error": "Failed to install KittenTTS"}
        
        from kittentts import KittenTTS
        import soundfile as sf
        import numpy as np
        
        # Initialize the model
        model = KittenTTS(config.get('model', 'KittenML/kitten-tts-nano-0.2'))
        
        # Generate audio
        audio = model.generate(config['text'], voice=config['voice'])
        
        # Handle output
        if config.get('output_path'):
            # Save to file
            sf.write(config['output_path'], audio, 24000)
            return {"output_path": config['output_path']}
        else:
            # Return audio data as base64
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
                sf.write(tmp_file.name, audio, 24000)
                
                with open(tmp_file.name, 'rb') as f:
                    audio_data = f.read()
                
                os.unlink(tmp_file.name)
                
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                return {"audio_data": audio_base64}
                
    except Exception as e:
        return {"error": str(e)}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "check":
        if check_installation():
            sys.exit(0)
        else:
            sys.exit(1)
    
    elif command == "install":
        if install_kittentts():
            print(json.dumps({"success": "KittenTTS installed successfully"}))
            sys.exit(0)
        else:
            sys.exit(1)
    
    elif command == "generate":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "No configuration provided"}))
            sys.exit(1)
        
        try:
            config = json.loads(sys.argv[2])
            result = generate_tts(config)
            print(json.dumps(result))
            
            if "error" in result:
                sys.exit(1)
            else:
                sys.exit(0)
                
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON configuration: {str(e)}"}))
            sys.exit(1)
    
    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
