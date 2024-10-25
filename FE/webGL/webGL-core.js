function createShader(webgl, type, source) {
    const shader = webgl.createShader(type)
    if (!shader) return null

    webgl.shaderSource(shader, source)
    webgl.compileShader(shader)
    // 判断是否编译成功
    const status = webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)
    if (!status) {
        const error = webgl.getShaderInfoLog(shader)
        console.error(`Failed to compilte shader---source:${source}--- error: ${error}`)
        webgl.deleteShader(shader)
    }

    return shader
}

function createProgram(webgl, vertextShaderObject, fragmentShaderObject) {
    const programObject = webgl.createProgram()
    webgl.attachShader(programObject, vertextShaderObject)
    webgl.attachShader(programObject, fragmentShaderObject)

    webgl.linkProgram(programObject)
    webgl.useProgram(programObject)

    return programObject
}

function onLoadImage(src, cb) {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src;
    image.onload = function() {
        cb && cb(image)
    }
}
// 创建纹理
function createTexture(webgl, src) {
    const texture = webgl.createTexture()
    texture.image = new Image()
    texture.image.src = src;
    texture.image.onload = function() {
        bindTexture(webgl, texture)
    }
    return texture
}

// 绑定处理纹理
function bindTexture(webgl, texture) {
    webgl.bindTexture(webgl.TEXTURE_2D, texture)
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, texture.image)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
}


function degToRad(d) {
    return d * Math.PI / 180;
}

// 画圆计算
function arcs(x, y, radius, startAngle = 0, endAngle = 360) {
    const ang = endAngle - startAngle;
    const poins = [x, y, 0];
    for (let i = 0; i <= ang; i++) {
        // i / ang 是当前角度占整个角度的比，然后总值2 * Math.PI = 360度， 2 * Math.PI * 比 = 当前的角度占比
        const are = 2 * Math.PI * (i / ang);
        const x1 = x + radius * Math.cos(are);
        const y1 =  y + radius * Math.sin(are);
        poins.push(x1, y1, 0);
    }
    return new Float32Array(poins);
}