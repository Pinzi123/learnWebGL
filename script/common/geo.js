//获取球体的顶点和索引数据
function getSpherePos(center,radius,statck=20,slice=50){
    let coordsList = [],indicesList = [], normalsList = [];
    let [statckStep,sliceStep] = [Math.PI/statck, Math.PI/slice];
    let r0,r1,x0,x1,y0,y1,z0,z1; //r0、r1为圆心引向两个临近切片部分表面的两条线 (x0,y0,z0)和(x1,y1,z1)为临近两个切面的点。
    let alpha0 = 0,alpha1 = 0; //前后两个角度
    let beta = 0; //切片平面上的角度

    //外层循环
    for( let i = 0;i < statck;i++ ){
        alpha0 =  (- Math.PI / 2 + (i*statckStep));
        alpha1 =  (- Math.PI / 2 + ((i+1)*statckStep));
        y0 =  (radius * Math.sin(alpha0));
        r0 =  (radius * Math.cos(alpha0));
        y1 =  (radius * Math.sin(alpha1));
        r1 =  (radius * Math.cos(alpha1));

        //循环每一层圆
        for( let j = 0;j <= (slice * 2);j ++ ){
            beta = j * sliceStep;
            x0 =  (r0 * Math.cos(beta));
            z0 = - (r0 * Math.sin(beta));
            x1 =  (r1 * Math.cos(beta));
            z1 = - (r1 * Math.sin(beta));
            coordsList.push(center[0] + x0);
            coordsList.push(center[1] + y0);
            coordsList.push(center[2] + z0);
            coordsList.push(center[0] + x1);
            coordsList.push(center[1] + y1);
            coordsList.push(center[2] + z1);
        }
    }
    return {coords:coordsList,indices:null,normals:coordsList,size:coordsList.length/3};
}


function crossXYZ(a, b) {
    var out = [];
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
  
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }


  function getSpherePosToCube(radius,time=0,statck=20,slice=50){
    let coordsList = [];
    statck -= time/7;
    slice  -= time/7;
    statck = statck>4?statck:4;
    slice  = slice>4 ?slice:4;
    let [statckStep,sliceStep] = [Math.PI/statck, Math.PI/slice];
    let r0,r1,x0,x1,y0,y1,z0,z1; //r0、r1为圆心引向两个临近切片部分表面的两条线 (x0,y0,z0)和(x1,y1,z1)为临近两个切面的点。
    let alpha0 = 0,alpha1 = 0; //前后两个角度
    let beta = 0; //切片平面上的角度

    //外层循环
    for( let i = 0;i < statck;i++ ){
        alpha0 =  (- Math.PI / 2 + (i*statckStep));
        alpha1 =  (- Math.PI / 2 + ((i+1)*statckStep));
        y0 =  (radius * Math.sin(alpha0));
        r0 =  (radius * Math.cos(alpha0));
        y1 =  (radius * Math.sin(alpha1));
        r1 =  (radius * Math.cos(alpha1));

        //循环每一层圆
        for( let j = 0;j <= (slice * 2);j ++ ){
            beta = j * sliceStep;
            x0 =  (r0 * Math.cos(beta));
            z0 = - (r0 * Math.sin(beta));
            x1 =  (r1 * Math.cos(beta));
            z1 = - (r1 * Math.sin(beta));

            coordsList.push(x0);
            coordsList.push(y0);
            coordsList.push(z0);


            coordsList.push(x1);
            coordsList.push(y1);
            coordsList.push(z1);
        }
    }
    return {coords:coordsList,size:coordsList.length/3};
}