const KittenTTS = require('./index');
const path = require('path');

async function example() {
    console.log('🎤 KittenTTS Node.js Example\n');

    try {
        // Initialize TTS
        console.log('Initializing KittenTTS...');
        const tts = new KittenTTS();

        // Check if model is available
        console.log('Checking model availability...');
        const isAvailable = await tts.isModelAvailable();
        if (!isAvailable) {
            console.error('❌ TTS model is not available. Please ensure Python dependencies are installed.');
            return;
        }
        console.log('✅ Model is ready!');

        // Show available voices
        console.log('\nAvailable voices:');
        const voices = tts.getAvailableVoices();
        voices.forEach((voice, index) => {
            console.log(`  ${index + 1}. ${voice}`);
        });

        // Generate speech examples
        const examples = [
            {
                text: "Hello! This is a test of the KittenTTS Node.js wrapper.",
                voice: 'expr-voice-2-f',
                filename: 'hello-female.wav'
            },
            {
                text: "This high quality text-to-speech model works without a GPU.",
                voice: 'expr-voice-3-m', 
                filename: 'demo-male.wav'
            },
            {
                text: "Node.js and Python working together seamlessly!",
                voice: 'expr-voice-4-f',
                filename: 'seamless-female.wav'
            }
        ];

        console.log('\nGenerating speech examples...');
        
        for (const example of examples) {
            console.log(`\n📝 Text: "${example.text}"`);
            console.log(`🎭 Voice: ${example.voice}`);
            
            const outputPath = path.join(__dirname, 'examples', example.filename);
            
            // Create examples directory if it doesn't exist
            const { execSync } = require('child_process');
            execSync('mkdir -p examples', { cwd: __dirname });
            
            const filePath = await tts.generateToFile(example.text, outputPath, example.voice);
            console.log(`💾 Saved: ${filePath}`);
        }

        console.log('\n🎉 All examples generated successfully!');
        console.log('Check the ./examples/ folder for the generated audio files.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run example
if (require.main === module) {
    example();
}

module.exports = example;
