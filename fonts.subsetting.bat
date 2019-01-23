set FILENAME="HouschkaPro-Medium"
set FILENAME=%FILENAME:"=%
call pyftsubset src\fonts\src\%FILENAME%.otf --output-file=src\fonts\%FILENAME%.ttf --unicodes-file=fonts-subsets.txt
call pyftsubset src\fonts\src\%FILENAME%.otf --output-file=src\fonts\%FILENAME%.woff --flavor=woff --unicodes-file=fonts-subsets.txt
call pyftsubset src\fonts\src\%FILENAME%.otf --output-file=src\fonts\%FILENAME%.woff2 --flavor=woff2 --unicodes-file=fonts-subsets.txt
call node_modules\.bin\ttf2eot src\fonts\%FILENAME%.ttf src\fonts\%FILENAME%.eot