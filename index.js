const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class KittenTTS {
    constructor(modelName = "KittenML/kitten-tts-nano-0.2") {
        this.modelName = modelName;
        this.pythonScript = path.join(__dirname, 'python-bridge.py');
        this.availableVoices = [
            'expr-voice-2-m', 'expr-voice-2-f', 'expr-voice-3-m', 'expr-voice-3-f',
            'expr-voice-4-m', 'expr-voice-4-f', 'expr-voice-5-m', 'expr-voice-5-f'
        ];
    }

    /**
     * Generate speech from text
     * @param {string} text - The text to convert to speech
     * @param {string} voice - The voice to use (default: 'expr-voice-2-f')
     * @param {string} outputPath - Optional output file path
     * @returns {Promise<Buffer|string>} Audio buffer or file path
     */
    async generate(text, voice = 'expr-voice-2-f', outputPath = null) {
        return new Promise((resolve, reject) => {
            if (!this.availableVoices.includes(voice)) {
                reject(new Error(`Invalid voice. Available voices: ${this.availableVoices.join(', ')}`));
                return;
            }

            const args = [
                this.pythonScript,
                'generate',
                JSON.stringify({
                    text: text,
                    voice: voice,
                    model: this.modelName,
                    output_path: outputPath
                })
            ];

            const python = spawn('python3', args);
            let stdout = '';
            let stderr = '';

            python.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            python.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            python.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python process failed: ${stderr}`));
                    return;
                }

                try {
                    const result = JSON.parse(stdout.trim());
                    if (result.error) {
                        reject(new Error(result.error));
                        return;
                    }

                    if (outputPath) {
                        resolve(result.output_path);
                    } else {
                        // Return audio data as Buffer
                        const audioBuffer = Buffer.from(result.audio_data, 'base64');
                        resolve(audioBuffer);
                    }
                } catch (parseError) {
                    reject(new Error(`Failed to parse Python output: ${parseError.message}`));
                }
            });
        });
    }

    /**
     * Generate speech and save to file
     * @param {string} text - The text to convert to speech
     * @param {string} outputPath - The output file path
     * @param {string} voice - The voice to use (default: 'expr-voice-2-f')
     * @returns {Promise<string>} The output file path
     */
    async generateToFile(text, outputPath, voice = 'expr-voice-2-f') {
        return await this.generate(text, voice, outputPath);
    }

    /**
     * Get list of available voices
     * @returns {Array<string>} Array of available voice names
     */
    getAvailableVoices() {
        return [...this.availableVoices];
    }

    /**
     * Check if the model is properly installed
     * @returns {Promise<boolean>} True if model is available
     */
    async isModelAvailable() {
        return new Promise((resolve) => {
            const args = [this.pythonScript, 'check'];
            const python = spawn('python3', args);
            
            python.on('close', (code) => {
                resolve(code === 0);
            });
        });
    }
}

module.exports = KittenTTS;
