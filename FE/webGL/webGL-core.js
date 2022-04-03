function createShader(webgl, type, source) {
    const shader = webgl.createShader(type)
    if (!shader) return null

    webgl.shaderSource(shader, source)
    webgl.compileShader(shader)
    // 判断是否编译成功
    const status = webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)
    if (!status) {
        const error = webgl.getShaderInfoLog(shader)
        console.error(`Failed to compilte shader: ${error}`)
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