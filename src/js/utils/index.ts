import { BackSide, FrontSide, Group, Material, Mesh, Points } from 'three';

export function disposeMesh(mesh: Mesh | Points) {
    mesh.geometry?.dispose();
    if (mesh.material) {
        if (mesh.material instanceof Array) {
            for (let i = 0; i < mesh.material.length; ++i) {
                mesh.material[i].dispose();
            }
        } else {
            mesh.material.dispose();
        }
    }
}

export function separateCullingPass(mesh: Mesh): Group {
    const group = new Group();

    [BackSide, FrontSide].forEach((side, i) => {
        const newMesh = mesh.clone();
        newMesh.name = `${newMesh.name}__clone${i + 1}`;

        if (mesh.material instanceof Material) {
            const material = mesh.material.clone();
            newMesh.material = material;
            material.transparent = true;
            material.side = side;
        }

        group.add(newMesh);

        if (mesh.parent) {
            mesh.parent.add(group);
            mesh.parent.remove(mesh);
            disposeMesh(mesh);
        }
    });

    return group;
}
