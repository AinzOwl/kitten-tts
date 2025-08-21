declare module 'kitten-tts' {
    type Voice = 
        | 'expr-voice-2-m' 
        | 'expr-voice-2-f' 
        | 'expr-voice-3-m' 
        | 'expr-voice-3-f'
        | 'expr-voice-4-m' 
        | 'expr-voice-4-f' 
        | 'expr-voice-5-m' 
        | 'expr-voice-5-f';

    class KittenTTS {
        /**
         * Create a new KittenTTS instance
         * @param modelName The model to use (default: "KittenML/kitten-tts-nano-0.2")
         */
        constructor(modelName?: string);

        /**
         * Generate speech from text
         * @param text The text to convert to speech
         * @param voice The voice to use (default: 'expr-voice-2-f')
         * @param outputPath Optional output file path
         * @returns Audio buffer or file path if outputPath is provided
         */
        generate(text: string, voice?: Voice, outputPath?: string): Promise<Buffer | string>;

        /**
         * Generate speech and save to file
         * @param text The text to convert to speech
         * @param outputPath The output file path
         * @param voice The voice to use (default: 'expr-voice-2-f')
         * @returns The output file path
         */
        generateToFile(text: string, outputPath: string, voice?: Voice): Promise<string>;

        /**
         * Get list of available voices
         * @returns Array of available voice names
         */
        getAvailableVoices(): Voice[];

        /**
         * Check if the model is properly installed
         * @returns True if model is available
         */
        isModelAvailable(): Promise<boolean>;
    }

    export = KittenTTS;
}
