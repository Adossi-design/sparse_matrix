## Sparse Matrix Processor

This program performs operations on sparse matrices loaded from text files.

## Quick Start

```bash
node src/sparse-matrix.js <operation> <matrix1> <matrix2>
```
## Operations
```
Operation              Command Example	                                   Requirements
Addition	           add matrix1.txt matrix2.txt	               Matrices must have the same dimensions
Subtraction     	   subtract A.txt B.txt                        Matrices must have the same dimensions
Multiplication  	   multiply X.txt Y.txt 	                     Columns of matrix X must equal rows of Y
```

## File Format

Matrix input and output files must follow this format:

```sql
rows=<number_of_rows>
cols=<number_of_columns>
(row, column, value)
(row, column, value)
```
## Example

Contents of sample_inputs/matrix1.txt:
```
rows=3
cols=3
(0, 0, 1)
(1, 1, 2)
(2, 2, 3)
```
## Usage Examples

### Check matrix dimensions
```bash
head -n 2 sample_inputs/*.txt
```

## Perform matrix addition

```bash
node src/sparse-matrix.js subtract matrix1.txt matrix2.txt
```
## View results

```bash
cat results/subtraction_result.txt
```
## Project Structure

```bash
sparse_matrix/
├── src/               # Main processor code
│   └── sparse-matrix.js
├── sample_inputs/     # Example matrices
│   ├── matrix1.txt
│   └── matrix2.txt
└── results/           # Output directory (auto-created)
```

## Troubleshooting

- **Dimensions mismatch:** Verify matrix sizes using head -n 2

- **File not found:** Run commands from the project root directory

- **Invalid format:** Ensure files follow the exact required format

- **Skipped entries:** Entries with out-of-bounds values are ignored

## Requirements

- Node.js v14 or higher

**Input files must:**

-Be in the same directory or specify full paths

-Have compatible dimensions for the selected operation

-Follow the exact format shown above

