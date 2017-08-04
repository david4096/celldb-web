import cdb from 'celldb-js';

var sample_ids;
var feature_ids;
var bufs = [];

function component() {
  var element = document.createElement('canvas');



  // Lodash, currently included via a script, is required for this line to work
  //element.innerHTML = "hi"
  cdb.list_samples("http://localhost:8080", function(ress) {
    //console.log(ress);
    sample_ids = ress.body['sample_ids'];
    cdb.list_features("http://localhost:8080", function(resf) {
      //console.log(resf)
      feature_ids = resf.body['feature_ids'];
      element.width = 2000;
      element.height = 2000;
      var ctx = element.getContext('2d');
      ctx.fillRect(0, 0, element.width, element.height);
      var width = 100;
      var height = 100;
      console.log(feature_ids);
      for (var i = 0; i < element.height; i += height) {
        for (var j = 0; j < element.width; j += width) {
          cdb.sparse_matrix("http://localhost:8080", sample_ids.slice(i, i + height), feature_ids.slice(j, j + width), function(res) {
            console.log(res.body);

            res.body['sample_ids'].map(function(sample, k) {
              ctx.fillStyle = "rgba(0, 0, 0)";

              Object.keys(res.body['values'][k]).map(function(index) {
                var feature_id = res.body['feature_ids'][index];
                var value = res.body['values'][k][index];
                var fpos = feature_ids.indexOf(feature_id);
                ctx.fillStyle = "rgba(255, 255, 255, " + value + ")";
                ctx.fillRect(fpos, sample_ids.indexOf(sample), 2, 2);
              });

            });

          })
        }
      }
    });
  })
  return element;
}
window.cdb = cdb;

console.log(cdb);



document.body.appendChild(component());
