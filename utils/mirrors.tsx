import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, useMatcapTexture, Octahedron } from '@react-three/drei';
import useSlerp from 'hooks/use-slerp';
import useLayers from 'hooks/use-layers';
import useRenderTarget from 'hooks/use-render-target';
import { ThinFilmFresnelMap } from 'utils/ThinFilmFresnelMap';

const mirrorsData = {
    mirrors: [
        {
            args: [2.87483173052424, 2.920755196190408, 0.05],
            position: [3.116376203948097, -2.1742814140991196, -7.998859699752443],
            rotation: [1.2536197471688286, -1.6683567077395978, -2.8428053193736256],
        },
        {
            args: [1.799233278635274, 1.9642524560408021, 0.05],
            position: [-3.325473394997085, 3.5307542721423446, -6.530151273151705],
            rotation: [1.3951213133257899, -0.2888432911308304, 0.7178380971731012],
        },
        {
            args: [2.8780801433198553, 2.9065216543855974, 0.05],
            position: [1.2839348832937714, 2.888947614684322, -6.467835086028824],
            rotation: [-1.3341775957580109, 2.8031736269533125, -0.18771283594857274],
        },
        {
            args: [2.2175936863874006, 1.3820832190972703, 0.05],
            position: [4.552400557892, 0.9814639517113943, -5.836395383986279],
            rotation: [-2.3299625953354437, 0.6139693063561498, -0.3902201705507059],
        },
        {
            args: [1.7446126775638997, 2.6211835436253392, 0.05],
            position: [-2.826056860647832, -3.0308788716782042, -5.4685371584057485],
            rotation: [-1.4052581815125295, 3.002812728418492, 2.54202362440499],
        },
        {
            args: [1.139549518339333, 1.8007363020629232, 0.05],
            position: [-0.041834072623521124, -1.351281881742426, -2.40411451302583],
            rotation: [1.2848394396618561, -0.310029190116405, -2.107987000676972],
        },
        {
            args: [2.2021865186914007, 2.610358395964105, 0.05],
            position: [-4.1542927375782015, -0.349560252979882, -2.489538720961452],
            rotation: [1.4401104979160235, 1.8179123712769852, -2.2157249608220475],
        },
        {
            args: [2.0964670262303393, 1.5750930602784585, 0.05],
            position: [6.571372497652996, -2.6457284555412066, -6.252562745592483],
            rotation: [1.1870955922970219, 0.5335941225301444, 0.4523391139946649],
        },
        {
            args: [1.3270056676441064, 1.5169873297208318, 0.05],
            position: [3.6761316187794724, -4.141729519755186, -4.39063863430271],
            rotation: [-0.7690386626408349, 1.4093151276977963, 2.0252977680762476],
        },
        {
            args: [5.1426105440458216, 4.416201863189162, 0.05],
            position: [0.646982562789564, 7.0909673302614196, -8.351518200349154],
            rotation: [-0.0692356415822184, 1.918047448701773, 0.5268942683942657],
        },
    ],
};

// const textData = [
//     {
//         position: [0, 0, -10],
//         rotation: [0, 0, 0],
//         scale: [1, 1, 1],
//     },
//     {
//         position: [0, 0, 10],
//         rotation: [0, 0, 0],
//         scale: [-1, 1, 1],
//     },
//     {
//         position: [-10, 0, 0],
//         rotation: [0, Math.PI / 2, 0],
//         scale: [1, 1, 1],
//     },
//     {
//         position: [10, 0, 0],
//         rotation: [0, -Math.PI / 2, 0],
//         scale: [-1, 1, 1],
//     },
//     {
//         position: [0, 10, 0],
//         rotation: [Math.PI / 2, 0, 0],
//         scale: [1, 1, 1],
//     },
//     {
//         position: [0, -10, 0],
//         rotation: [-Math.PI / 2, 0, 0],
//         scale: [-1, 1, 1],
//     },
// ];

const TEXT_PROPS = {
    fontSize: 2.5,
    font: 'https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff',
};

function Title({ layers, ...props }) {
    const group = useRef();
    useEffect(() => {
        group.current.lookAt(0, 0, 0);
    }, []);

    const textRef = useLayers(layers);

    return (
        <group {...props} ref={group}>
            <Text
                ref={textRef}
                name="text-panna"
                depthTest={false}
                material-toneMapped={false}
                material-color="#FFFFFF"
                {...TEXT_PROPS}
            >
                PANNA
            </Text>
        </group>
    );
}

function Mirror({ sideMaterial, reflectionMaterial, args, layers, ...props }) {
    const ref = useLayers(layers);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
            ref.current.rotation.z += 0.01;
        }
    });

    return (
        <Box
            {...props}
            ref={ref}
            args={args}
            material={[sideMaterial, sideMaterial, sideMaterial, sideMaterial, reflectionMaterial, reflectionMaterial]}
        />
    );
}

function Mirrors({ envMap, layers, ...props }) {
    const [thinFilmFresnelMap] = useState(new ThinFilmFresnelMap());
    const sideMaterial = useRef();
    const reflectionMaterial = useRef();

    return (
        <group name="mirrors" {...props}>
            <meshLambertMaterial ref={sideMaterial} map={thinFilmFresnelMap} color="#AAAAAA" />
            <meshLambertMaterial ref={reflectionMaterial} map={thinFilmFresnelMap} envMap={envMap} color="#FFFFFF" />
            {mirrorsData.mirrors.map((mirror, index) => (
                <Mirror
                    key={`mirror-${index}`}
                    layers={layers}
                    {...mirror}
                    name={`mirror-${index}`}
                    sideMaterial={sideMaterial.current}
                    reflectionMaterial={reflectionMaterial.current}
                />
            ))}
        </group>
    );
}

function TitleCopies({ layers }) {
    const vertices = useMemo(() => {
        const y = new THREE.IcosahedronBufferGeometry(10);
        return y.vertices;
    }, []);

    return (
        <group name="titleCopies">
            {vertices.map((vertex, i) => (
                <Title key={`title-${i}`} name={'titleCopy-' + i} position={vertex} layers={layers} />
            ))}
        </group>
    );
}

function Scene() {
    const [cubeCamera, renderTarget] = useRenderTarget();
    const group = useSlerp();

    const [matcapTexture] = useMatcapTexture('C8D1DC_575B62_818892_6E747B');

    return (
        <Canvas dpr={[1, 2]} gl={{ antialias: false, alpha: false }}>
            <group name="sceneContainer" ref={group}>
                <Octahedron layers={[11]} name="background" args={[20, 4, 4]} position={[0, 0, -5]}>
                    <meshMatcapMaterial
                        matcap={matcapTexture}
                        side={THREE.BackSide}
                        transparent
                        opacity={0.3}
                        color="#FFFFFF"
                    />
                </Octahedron>
                <cubeCamera
                    layers={[11]}
                    name="cubeCamera"
                    ref={cubeCamera}
                    args={[0.1, 100, renderTarget]}
                    position={[0, 0, 5]}
                />
                <Title name="title" position={[0, 0, -10]} />
                <TitleCopies layers={[11]} />
                <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
            </group>
        </Canvas>
    );
}

export default Scene;
