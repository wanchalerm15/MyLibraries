// ทำให้การแสดงผลเหมือนกัน pinterest
function sortGridItems(arrays, column) {
    // check empty arrays
    arrays = arrays || [];
    if (arrays.length == 0) return [];
    // defind variable
    var items = arrays,
        length = arrays.length,
        limit = column,
        columns = [],
        index = 0;
    for (var i = 0; i < limit; i++) {
        index = i + 1;
        columns[i] = [];
        items.forEach(function() {
            if (index <= length) {
                columns[i].push(items[index - 1]);
                index += limit;
            }
        });
    }
    return columns;
}
