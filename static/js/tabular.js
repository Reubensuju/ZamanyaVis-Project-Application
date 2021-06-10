const data = [];
const fileInput = document.querySelector('.fileInput');
fileInput.addEventListener('change', () => {
  Papa.parse(fileInput.files[0], {
    download: true,
    keepEmptyRows: false,
    skipEmptyLines: true,
    step: function(row) {
      data.push(row.data);
    },
    complete: function(results) {
      console.log(data);
      console.log(data[2][0])
    }
  });
});

