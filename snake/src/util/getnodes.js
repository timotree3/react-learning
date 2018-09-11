const getNodes = ({x, y, extensions}) => {
    let nodes = [{x, y}];
    let currentX = x;
    let currentY = y;
    for (let direction of extensions) {
        let offset = direction.toOffset();
        currentX += offset.x;
        currentY += offset.y;
        nodes.push({x: currentX, y: currentY});
    }
    return nodes;
}

export default getNodes
