# discovery

Discovery is an [elasticsearch](http://www.elasticsearch.org) plugin to visualize and explore [OpenStreetMap](http://www.openstreetmap.org) 
data, indexed using [elasticsearch-osmosis-plugin](https://github.com/ncolomer/elasticsearch-osmosis-plugin).

## Features

* Search for indexed OpenStreetMap features (node, way or both)
* Filter on features name and/or tags
* Set max number of features drawn on the map
* Draw Rectangle or Polygon as Shape filter (defaults to map's bounds)

## Installation

### The quick way, using the online version

Open your favorite browser and connect to [ncolomer.github.io/discovery](http://ncolomer.github.io/discovery)

### The manual way, as an elasticsearch plugin

Install on an elasticsearch node as a site plugin: 

```bash
# cd to the elasticsearch installation directory
sudo bin/plugin -install ncolomer/discovery
```

Open your favorite browser and connect to `http://{node_ip}:{node_http_port}/_plugin/discovery/`, with:

* `{node_ip}` the elasticsearch node IP, e.g. 192.168.10.11
* `{node_http_port}` the elasticsearch node HTTP listening port, e.g. 9200 

## Screenshots

[<img src="https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/discovery1.png" alt="Discovery screenshot #1" width="200" />](https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/discovery1.png)
[<img src="https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/discovery2.png" alt="Discovery screenshot #2" width="200" />](https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/discovery2.png)
[<img src="https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/discovery3.png" alt="Discovery screenshot #3" width="200" />](https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/discovery3.png)

## License

This plugin is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)  
OpenStreetMap data is licensed under the [Open Data Commons Open Database License](http://opendatacommons.org/licenses/odbl/1.0/) (ODbL)

## Powered by

[![OpenStreetMap](https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/openstreetmap.png)](http://www.openstreetmap.org)
[![elasticsearch](https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/elasticsearch.png)](http://www.elasticsearch.org)
[![SourceForge](https://raw.github.com/ncolomer/elasticsearch-osmosis-plugin/master/assets/sourceforge.png)](http://www.sourceforge.net)
