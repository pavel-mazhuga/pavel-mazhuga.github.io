set FILENAME="PF_Centro_Slab_Pro_Regular"
set FILENAME=%FILENAME:"=%
call pyftsubset source\fonts\src\%FILENAME%.ttf --output-file=source\fonts\%FILENAME%.ttf --unicodes-file=fonts-subsets.txt
call pyftsubset source\fonts\src\%FILENAME%.ttf --output-file=source\fonts\%FILENAME%.woff --flavor=woff --unicodes-file=fonts-subsets.txt
call pyftsubset source\fonts\src\%FILENAME%.ttf --output-file=source\fonts\%FILENAME%.woff2 --flavor=woff2 --unicodes-file=fonts-subsets.txt
call node_modules\.bin\ttf2eot source\fonts\%FILENAME%.ttf source\fonts\%FILENAME%.eot
