// https://observablehq.com/@jpedroes/poc-visualizacao-de-minucias-em-impressoes-digitais-de-um-m/3@450
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# POC - Visualização de minúcias em impressões digitais de um mesmo indivíduo`
)});
  main.variable(observer("viewof id_img")).define("viewof id_img", ["Select"], function(Select){return(
Select([5].concat(1,2,3,4,5), {label: "Id Probe"})
)});
  main.variable(observer("id_img")).define("id_img", ["Generators", "viewof id_img"], (G, _) => G.input(_));
  main.variable(observer("viewof id_cand")).define("viewof id_cand", ["Select"], function(Select){return(
Select([2].concat(3,4,5), {label: "Id Candidate"})
)});
  main.variable(observer("id_cand")).define("id_cand", ["Generators", "viewof id_cand"], (G, _) => G.input(_));
  main.variable(observer("buildvis")).define("buildvis", ["md","container"], function(md,container)
{
  let view = md`${container()}`
  return view
}
);
  main.variable(observer("map")).define("map", ["buildvis","L","urlprobe","boundsprobe","urlcandidate","boundscandidate"], function(buildvis,L,urlprobe,boundsprobe,urlcandidate,boundscandidate)
{
  buildvis;
  let mapInstance = L.map('mapid', {
                                  crs: L.CRS.Simple,
                                  minZoom: -3
                                });
  L.imageOverlay(urlprobe, boundsprobe).addTo(mapInstance);
  L.imageOverlay(urlcandidate, boundscandidate).addTo(mapInstance);
  return mapInstance
}
);
  main.variable(observer("yx")).define("yx", ["L"], function(L){return(
L.latLng
)});
  main.variable(observer("xy")).define("xy", ["L","yx"], function(L,yx){return(
function(x, y) {
  if (L.Util.isArray(x)) {    // When doing xy([x, y]);
    return yx(x[1], x[0]);
  }
  return yx(y, x);  // When doing xy(x, y);
}
)});
  main.variable(observer("boundsprobe")).define("boundsprobe", ["xy","offset_x","offset_y"], function(xy,offset_x,offset_y){return(
[xy(0, 0), xy(offset_x, offset_y)]
)});
  main.variable(observer("boundscandidate")).define("boundscandidate", ["xy","offset_x","offset_y"], function(xy,offset_x,offset_y){return(
[xy(offset_x, 0), xy(offset_x*2, offset_y)]
)});
  main.variable(observer("circlesCandidate")).define("circlesCandidate", ["circlesCandidateLayer","datasetcandidate","L","offset_x","roots","offset_y","datasetprobe","circlesProbeLayer"], function(circlesCandidateLayer,datasetcandidate,L,offset_x,roots,offset_y,datasetprobe,circlesProbeLayer)
{
 circlesCandidateLayer.clearLayers()
  datasetcandidate.forEach( function(d,i) {
   let circle = L.circle([d.y, offset_x+d.x], 5, {
     color: 'blue',
     weight: 2,
     fillColor: 'blue',
     fillOpacity: 0.5,
     id: d.x+'-'+d.y
   });

   let collectionCircles = []
    // pegar a coordenadas x,y para cada minúcia correspondent
   roots.forEach(function (d) {
      //console.log(d.probe)  
      if (d.candidate == i) {
        let circlePair = L.circle( [offset_y - datasetprobe[d.candidate].y, datasetprobe[d.candidate].x], 5, {
          color: 'orange',
          weight: 2,
          fillColor: 'orange',
          fillOpacity: 0.5
        });
        collectionCircles.push(circlePair)
      }
    });
    
    
   circle.on('mouseover', function (e) {
     this.setStyle({
        color: 'orange',
        fillColor:'orange'
     });
     collectionCircles.forEach(function(c) {
        circlesProbeLayer.addLayer(c)
     });
     //circlesProbeLayer.addLayer(circlePair)
   });
   circle.on('mouseout', function (e) {
     this.setStyle({
       color: 'blue', 
       fillColor:'blue'
     });
     collectionCircles.forEach(function(c) {
        circlesProbeLayer.removeLayer(c)
     });
     //circlesProbeLayer.removeLayer(circlePair)
   });
   circle.bindPopup(d.x+","+d.y); //debug
   circlesCandidateLayer.addLayer(circle) })
}
);
  main.variable(observer("circlesProbeLayer")).define("circlesProbeLayer", ["L","map"], function(L,map){return(
L.layerGroup().addTo(map)
)});
  main.variable(observer("circlesProbe")).define("circlesProbe", ["circlesProbeLayer","datasetprobe","L","offset_y","roots","datasetcandidate","offset_x","circlesCandidateLayer"], function(circlesProbeLayer,datasetprobe,L,offset_y,roots,datasetcandidate,offset_x,circlesCandidateLayer)
{
 circlesProbeLayer.clearLayers()
 datasetprobe.forEach( function(d,i) {

   //console.log( `${d.x} ${d.y}  ${i}`)

   let circle = L.circle([offset_y - d.y, d.x], 5, {
     color: 'blue',
     weight: 2,
     fillColor: 'blue',
     fillOpacity: 0.1,
     id: d.x+'-'+d.y
   });

    let collectionCircles = []
   // let circleIds = [] 
    roots.forEach(function (d) {
      //console.log(d.probe)  
      if (d.probe == i) {
        let circlePair = L.circle([datasetcandidate[d.candidate].y, offset_x + datasetcandidate[d.candidate].x], 5, {
          color: 'orange',
          weight: 2,
          fillColor: 'orange',
          fillOpacity: 0.5
        });
        collectionCircles.push(circlePair)
      }
    });
     
   circle.on('mouseover', function (e) {
     this.setStyle({
        fillOpacity: 0.5
     });
     collectionCircles.forEach(function(c) {
        circlesCandidateLayer.addLayer(c)
     });
     //circlesCandidateLayer.addLayer(circlePair)
   });
   circle.on('mouseout', function (e) {
     this.setStyle({
       fillOpacity: 0.1
     });
     collectionCircles.forEach(function(c) {
        circlesCandidateLayer.removeLayer(c)
     });
     //circlesCandidateLayer.removeLayer(circlePair)
   });
   circle.bindPopup(d.x+","+d.y); //debug
   circlesProbeLayer.addLayer(circle) })
}
);
  main.variable(observer("circlesCandidateLayer")).define("circlesCandidateLayer", ["L","map"], function(L,map){return(
L.layerGroup().addTo(map)
)});
  main.variable(observer("matchingsLayer")).define("matchingsLayer", ["L","map"], function(L,map){return(
L.layerGroup().addTo(map)
)});
  main.variable(observer("matchingsds")).define("matchingsds", ["xy"], function(xy){return(
[{'i': xy(355, 267), 'f': xy(372, 242)}]
)});
  main.variable(observer()).define(["map","xy","offset_x","offset_y"], function(map,xy,offset_x,offset_y){return(
map.setView(xy(offset_x, offset_y/2), -1)
)});
  main.variable(observer("container")).define("container", function(){return(
function container() { 
  return `
<main role="main" class="container">
    <div class="row">
      <h3> Minúcias em uma impressão digital</h3>
    </div>
    <div id="mapid" class='row'>
    </div>
   <p>Imagem da base FVC 2004</a></p>
  </main>
 `
}
)});
  main.variable(observer("images_ref")).define("images_ref", ["d3"], function(d3){return(
d3.json('https://raw.githubusercontent.com/lucasfernandes42/fingerprintviz/master/dataset/2004_DB1/img_data.json').then(function(data){
  data = data.captures
  return data;
})
)});
  main.variable(observer("features_ref")).define("features_ref", ["d3"], function(d3){return(
d3.json('https://raw.githubusercontent.com/lucasfernandes42/fingerprintviz/master/dataset/JSON/templates_data.json').then(function(data){
  data = data.matching
  return data;
})
)});
  main.variable(observer("urlprobe")).define("urlprobe", ["images_ref","id_img"], function(images_ref,id_img){return(
images_ref[id_img-1][1]
)});
  main.variable(observer("urlcandidate")).define("urlcandidate", ["images_ref","id_img","id_cand"], function(images_ref,id_img,id_cand){return(
images_ref[id_img-1][id_cand]
)});
  main.variable(observer("datasetprobe")).define("datasetprobe", ["d3","features_ref","id_img","id_cand"], function(d3,features_ref,id_img,id_cand){return(
d3.json(features_ref[id_img-1][id_cand].template_probe).then(function(data){
    data = data.minutiae
    data.forEach(function(d){
      d.x = d.position.x
      d.y = d.position.y
    });
  return data;
})
)});
  main.variable(observer("datasetcandidate")).define("datasetcandidate", ["d3","features_ref","id_img","id_cand"], function(d3,features_ref,id_img,id_cand){return(
d3.json(features_ref[id_img-1][id_cand].template_cand).then(function(data){
    data = data.minutiae
    data.forEach(function(d){
      d.x = d.position.x
      d.y = d.position.y
    });
  return data;
})
)});
  main.variable(observer("roots")).define("roots", ["d3","features_ref","id_img","id_cand"], function(d3,features_ref,id_img,id_cand){return(
d3.json(features_ref[id_img-1][id_cand].roots)
)});
  main.variable(observer("offset_x")).define("offset_x", function(){return(
640
)});
  main.variable(observer("offset_y")).define("offset_y", function(){return(
480
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("bootstrap")).define("bootstrap", ["require"], function(require){return(
require('bootstrap')
)});
  main.variable(observer("L")).define("L", ["require"], function(require){return(
require('leaflet@1.6.0')
)});
  main.variable(observer("Inputs")).define("Inputs", ["require"], function(require){return(
require("@observablehq/inputs@0.7.19/dist/inputs.umd.min.js")
)});
  main.variable(observer("Select")).define("Select", ["Inputs"], function(Inputs){return(
Inputs.Select
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<code>css</code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link rel="stylesheet" type="text/css" href="https://unpkg.com/dc@4/dist/style/dc.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<style>
  #mapid {
    width: 650px;
    height: 480px;
    background: white;
  }
</style>`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`Esta célula contém os estilos da Visualização
<style>
#mapid {
				width: 750px;
				height: 480px;
			}
			.info {
				padding: 6px 8px;
				font: 14px/16px Arial, Helvetica, sans-serif;
				background: white;
				background: rgba(255,255,255,0.8);
				box-shadow: 0 0 15px rgba(0,0,0,0.2);
				border-radius: 5px;
			}
			.info h4 {
				margin: 0 0 5px;
				color: #777;
			}

			.legend {
				text-align: left;
				line-height: 18px;
				color: #555;
			}
			.legend i {
				width: 18px;
				height: 18px;
				float: left;
				margin-right: 8px;
				opacity: 0.7;
			}
</style>`
)});
  return main;
}
