var matrix = {
    // 像素坐标转换到裁剪空（投影），同时反转Y轴
    projection: function(width, height) {
        // x       y     z
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
          ];
    }
}