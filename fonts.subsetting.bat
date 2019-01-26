set SRC_FORMAT="ttf"
set SRC_FORMAT=%SRC_FORMAT:"=%

set FILENAME="HouschkaPro-Medium"
set FILENAME=%FILENAME:"=%
call pyftsubset src\fonts\src\%FILENAME%.%SRC_FORMAT% --output-file=src\fonts\%FILENAME%.ttf --unicodes-file=fonts-subsets.txt
call pyftsubset src\fonts\src\%FILENAME%.%SRC_FORMAT% --output-file=src\fonts\%FILENAME%.woff --flavor=woff --unicodes-file=fonts-subsets.txt
call pyftsubset src\fonts\src\%FILENAME%.%SRC_FORMAT% --output-file=src\fonts\%FILENAME%.woff2 --flavor=woff2 --unicodes-file=fonts-subsets.txt
call node_modules\.bin\ttf2eot src\fonts\%FILENAME%.ttf src\fonts\%FILENAME%.eot