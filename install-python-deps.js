const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('Installing KittenTTS Python dependencies...');

function installPythonDeps() {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, 'python-bridge.py');
        const python = spawn('python3', [pythonScript, 'install']);
        
        let stdout = '';
        let stderr = '';
        
        python.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            
            // Parse JSON status messages
            const lines = output.trim().split('\n');
            lines.forEach(line => {
                try {
                    const status = JSON.parse(line);
                    if (status.status) {
                        console.log(`📦 ${status.status}`);
                    }
                } catch (e) {
                    // Not JSON, just regular output
                    if (line.trim()) {
                        process.stdout.write(line + '\n');
                    }
                }
            });
        });
        
        python.stderr.on('data', (data) => {
            stderr += data.toString();
            process.stderr.write(data);
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                console.log('✅ KittenTTS is ready to use!');
                resolve();
            } else {
                console.error('❌ Failed to install KittenTTS dependencies');
                console.error(stderr);
                reject(new Error(`Installation failed with code ${code}`));
            }
        });
    });
}

// Check if Python is available
try {
    execSync('python3 --version', { stdio: 'ignore' });
} catch (error) {
    console.error('❌ Python 3 is required but not found in PATH');
    console.error('Please install Python 3 and try again.');
    process.exit(1);
}

// Install Python dependencies
installPythonDeps().catch((error) => {
    console.error('Installation failed:', error.message);
    process.exit(1);
});
