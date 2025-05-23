const fs = require('fs');
const path = require('path');

// Represents a sparse matrix using a dictionary of non-zero values

class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = {}; // { "row,col": value }
    }

    // Create SparseMatrix instance from a file
	
    static fromFile(filepath) {
        const lines = fs.readFileSync(filepath, 'utf-8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (!lines[0].startsWith('rows=') || !lines[1].startsWith('cols=')) {
            throw new Error("Input file format must start with 'rows=' and 'cols=' lines.");
        }

        const rows = parseInt(lines[0].split('=')[1]);
        const cols = parseInt(lines[1].split('=')[1]);

        const matrix = new SparseMatrix(rows, cols);

        for (let i = 2; i < lines.length; i++) {
            const match = lines[i].match(/^\((\d+),\s*(\d+),\s*(-?\d+)\)$/);
            if (!match) {
                throw new Error(`Invalid line format: ${lines[i]}`);
            }

            const [, r, c, v] = match;
            matrix.set(parseInt(r), parseInt(c), parseInt(v));
        }

        return matrix;
    }

    // Set value at (row, col)

    set(row, col, value) {
        if (value !== 0) {
            this.data[`${row},${col}`] = value;
        }
    }

    // Get value at (row, col); defaults to 0 if not set
	
    get(row, col) {
        return this.data[`${row},${col}`] || 0;
    }

    // Add this matrix to another
	
    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions must match for addition.");
        }

        const result = new SparseMatrix(this.rows, this.cols);

        for (const key in this.data) {
            result.data[key] = this.data[key];
        }

        for (const key in other.data) {
            result.data[key] = (result.data[key] || 0) + other.data[key];
            if (result.data[key] === 0) {
                delete result.data[key]; // Clean up zero entries
            }
        }

        return result;
    }

    // Subtract another matrix from this one
	
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions must match for subtraction.");
        }

        const result = new SparseMatrix(this.rows, this.cols);

        for (const key in this.data) {
            result.data[key] = this.data[key];
        }

        for (const key in other.data) {
            result.data[key] = (result.data[key] || 0) - other.data[key];
            if (result.data[key] === 0) {
                delete result.data[key]; // Clean up zero entries
            }
        }

        return result;
    }

    // Multiply this matrix with another
	
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error("Matrix multiplication requires A.cols == B.rows.");
        }

        const result = new SparseMatrix(this.rows, other.cols);

        for (const keyA in this.data) {
            const [i, k] = keyA.split(',').map(Number);
            for (let j = 0; j < other.cols; j++) {
                const keyB = `${k},${j}`;
                if (other.data[keyB] !== undefined) {
                    const current = result.get(i, j);
                    const value = this.data[keyA] * other.data[keyB];
                    result.set(i, j, current + value);
                }
            }
        }

        return result;
    }

    // Export matrix to a file
	
    toFile(outputPath) {
        let content = `rows=${this.rows}\ncols=${this.cols}\n`;
        for (const key in this.data) {
            const [r, c] = key.split(',');
            content += `(${r}, ${c}, ${this.data[key]})\n`;
        }
        fs.writeFileSync(outputPath, content.trim(), 'utf-8');
    }
}

// Main CLI logic

function main() {
    const [,, operation, file1, file2] = process.argv;

    if (!operation || !file1 || !file2) {
        console.error("Usage: node src/sparse-matrix.js add|subtract|multiply file1 file2");
        return;
    }

    if (!['add', 'subtract', 'multiply'].includes(operation)) {
        console.error(`Unsupported operation "${operation}". Use add, subtract, or multiply.`);
        return;
    }

    try {
        const inputDir = 'sample_inputs';
        const outputDir = 'results';

        const m1 = SparseMatrix.fromFile(path.join(inputDir, file1));
        const m2 = SparseMatrix.fromFile(path.join(inputDir, file2));

        let result;
        if (operation === 'add') {
            result = m1.add(m2);
        } else if (operation === 'subtract') {
            result = m1.subtract(m2);
        } else {
            result = m1.multiply(m2);
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const outputPath = path.join(outputDir, `result_${operation}.txt`);
        result.toFile(outputPath);

        console.log(`${operation.toUpperCase()} completed successfully.`);
        console.log(`Result written to: ${outputPath}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
