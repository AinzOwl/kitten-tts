# KittenTTS Node.js Wrapper

A Node.js wrapper for KittenTTS - High quality text-to-speech synthesis without GPU requirements.

## Installation

```bash
npm install kitten-tts
```

The package will automatically install the required Python dependencies (KittenTTS wheel and soundfile) during installation. **If the dependencies are already installed, the installation process will detect them and skip reinstallation**, making subsequent installs much faster.

### Installation Behavior

- **First install**: Downloads and installs KittenTTS wheel (~50MB) and soundfile
- **Subsequent installs**: Detects existing installation and skips download
- **Partial installs**: Only installs missing components if some dependencies exist

The installer is smart about checking what's already available and only installs what's needed.

## Requirements

- Node.js 14+ 
- Python 3.7+
- pip

## Quick Start

```javascript
const KittenTTS = require('kitten-tts');

async function example() {
    // Initialize TTS
    const tts = new KittenTTS();
    
    // Generate speech to buffer
    const audioBuffer = await tts.generate(
        "Hello from KittenTTS!", 
        'expr-voice-2-f'
    );
    
    // Generate speech to file
    await tts.generateToFile(
        "Hello from KittenTTS!", 
        './output.wav',
        'expr-voice-2-f'
    );
    
    console.log('Audio generated successfully!');
}

example().catch(console.error);
```

## API Reference

### Constructor

#### `new KittenTTS(modelName?)`

Creates a new KittenTTS instance.

- `modelName` (optional): Model to use. Default: `"KittenML/kitten-tts-nano-0.2"`

```javascript
const tts = new KittenTTS(); // Uses default model
const tts2 = new KittenTTS("KittenML/kitten-tts-nano-0.2"); // Explicit model
```

### Methods

#### `generate(text, voice?, outputPath?)`

Generate speech from text.

- `text` (string): Text to convert to speech
- `voice` (string, optional): Voice to use. Default: `'expr-voice-2-f'`
- `outputPath` (string, optional): If provided, saves audio to file and returns path

Returns: `Promise<Buffer|string>` - Audio buffer or file path

```javascript
// Generate to buffer
const audioBuffer = await tts.generate("Hello world!", 'expr-voice-2-f');

// Generate to file
const filePath = await tts.generate("Hello world!", 'expr-voice-2-f', './output.wav');
```

#### `generateToFile(text, outputPath, voice?)`

Generate speech and save to file.

- `text` (string): Text to convert to speech  
- `outputPath` (string): Output file path
- `voice` (string, optional): Voice to use. Default: `'expr-voice-2-f'`

Returns: `Promise<string>` - The output file path

```javascript
const filePath = await tts.generateToFile(
    "Hello world!", 
    './my-audio.wav', 
    'expr-voice-3-m'
);
```

#### `getAvailableVoices()`

Get list of available voices.

Returns: `Array<string>` - Array of voice names

```javascript
const voices = tts.getAvailableVoices();
console.log(voices);
// Output: ['expr-voice-2-m', 'expr-voice-2-f', 'expr-voice-3-m', ...]
```

#### `isModelAvailable()`

Check if the TTS model is properly installed and available.

Returns: `Promise<boolean>` - True if model is available

```javascript
const isReady = await tts.isModelAvailable();
if (isReady) {
    console.log('TTS is ready to use!');
}
```

## Available Voices

The following voices are available:

- `expr-voice-2-m` - Male voice 2
- `expr-voice-2-f` - Female voice 2  
- `expr-voice-3-m` - Male voice 3
- `expr-voice-3-f` - Female voice 3
- `expr-voice-4-m` - Male voice 4
- `expr-voice-4-f` - Female voice 4
- `expr-voice-5-m` - Male voice 5
- `expr-voice-5-f` - Female voice 5

## Examples

### Basic Usage

```javascript
const KittenTTS = require('kitten-tts');

async function basicExample() {
    const tts = new KittenTTS();
    
    // Check if ready
    if (!(await tts.isModelAvailable())) {
        console.error('TTS model not available');
        return;
    }
    
    // Generate speech
    const audioBuffer = await tts.generate(
        "This high quality TTS model works without a GPU",
        'expr-voice-2-f'
    );
    
    console.log(`Generated ${audioBuffer.length} bytes of audio`);
}

basicExample().catch(console.error);
```

### Saving Multiple Files

```javascript
const KittenTTS = require('kitten-tts');
const path = require('path');

async function multipleFiles() {
    const tts = new KittenTTS();
    
    const texts = [
        "Hello from voice 2 female",
        "Hello from voice 3 male", 
        "Hello from voice 4 female"
    ];
    
    const voices = ['expr-voice-2-f', 'expr-voice-3-m', 'expr-voice-4-f'];
    
    for (let i = 0; i < texts.length; i++) {
        const outputPath = path.join(__dirname, `output-${i + 1}.wav`);
        await tts.generateToFile(texts[i], outputPath, voices[i]);
        console.log(`Generated: ${outputPath}`);
    }
}

multipleFiles().catch(console.error);
```

### Error Handling

```javascript
const KittenTTS = require('kitten-tts');

async function withErrorHandling() {
    const tts = new KittenTTS();
    
    try {
        // This will throw an error - invalid voice
        await tts.generate("Test", "invalid-voice");
    } catch (error) {
        console.error('Error:', error.message);
        // Output: Error: Invalid voice. Available voices: expr-voice-2-m, expr-voice-2-f, ...
    }
    
    try {
        // This should work
        const buffer = await tts.generate("Test", "expr-voice-2-f");
        console.log('Success!', buffer.length, 'bytes');
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

withErrorHandling().catch(console.error);
```

## Testing

Run the included test suite:

```bash
npm test
```

## Troubleshooting

### Python Installation Issues

If you encounter Python-related errors:

1. Ensure Python 3.7+ is installed and available as `python3`
2. Ensure pip is installed
3. Try manually installing: `pip install https://github.com/KittenML/KittenTTS/releases/download/0.1/kittentts-0.1.0-py3-none-any.whl`

### Permission Issues

If you get permission errors during installation:

```bash
npm install kitten-tts --unsafe-perm
```

### Model Loading Issues

If the model fails to load:

1. Check internet connection (model downloads on first use)
2. Ensure sufficient disk space
3. Try reinitializing: `new KittenTTS()`

## License

MIT License

## Contributing

Issues and pull requests are welcome on the project repository.

## Credits

This package is a Node.js wrapper around [KittenTTS](https://github.com/KittenML/KittenTTS) by KittenML.
