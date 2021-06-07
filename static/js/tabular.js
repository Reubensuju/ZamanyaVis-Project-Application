const data = [];
const fileInput = document.querySelector('.fileInput');
fileInput.addEventListener('change', () => {
  Papa.parse(fileInput.files[0], {
    download: true,
    header: true,
    keepEmptyRows: false,
    skipEmptyLines: true,
    step: function(row) {
      data.push(row.data);
    },
    complete: function(results) {
      console.log(data);
    }
  });
});