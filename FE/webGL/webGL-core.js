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