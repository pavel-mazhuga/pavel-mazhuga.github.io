mkdir -p $1
rm -rf $1/*
cp $1.glb ./$1
cd $1

# gltf-transform instance $1.glb $1.glb
gltf-transform resample $1.glb $1.glb
gltf-transform dedup $1.glb $1.glb
gltf-transform prune $1.glb $1.glb

# gltf-pipeline -i $1.glb -o $1.gltf -s --keepUnusedElements

# for filename in *.jpg; do
#     npx @squoosh/cli --mozjpeg '{"quality":90,"baseline":false,"arithmetic":false,"progressive":true,"optimize_coding":true,"smoothing":0,"color_space":3,"quant_table":3,"trellis_multipass":false,"trellis_opt_zero":false,"trellis_opt_table":false,"trellis_loops":1,"auto_subsample":true,"chroma_subsample":2,"separate_chroma_quality":false,"chroma_quality":75}' ${filename}
# done

# for filename in *.png; do
#     npx @squoosh/cli --oxipng '{"level":2,"interlace":false}' ${filename}
# done

# gltf-pipeline -i $1.gltf -o $1.glb --keepUnusedElements

# gltf-transform resize $1.glb $1.glb --width=1024 --height=1024
# gltf-transform weld $1.glb $1.glb
# gltf-transform etc1s $1.glb $1.glb

# gltf-pipeline -i $1.glb -o $1-opt.glb -d --keepUnusedElements

cp $1-opt.glb ..
cd ..
rm -rf $1

echo "$1.glb was successfully optimized."