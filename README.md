# WikiGraphBrowser

Forked from cgmartin project.

Experimentation with [D3.js](http://mbostock.github.com/d3/) force-directed 
graphs using iTunes library data.

**See a [running demo](http://www.wikigraph.net/static/d3/cgmartin/WikiGraphBrowser).**

## Installation

1. Clone project into a public web server path.
2. Point browser to `index.html` on your web server.

### 2 Input files to choose from

CgMartin's code uses int ids for nodes and uses those to define links. I'm hoping to avoid that and just refer to nodes by unique names. But that isn't working now.

If you want the display to work, copy `input_graph_int_id.json` over `input_graph.json`. If you want to experiment with the broken state, use `input_graph_txt_id.json`.

### iTunesGraphParser.py

A python command line script is included that parses an iTunes library file
and outputs JSON data.

    Usage: iTunesGraphParser.py [options]

    Options:
      --version             show program's version number and exit
      -h, --help            show this help message and exit
      -f FILE, --file=FILE  iTunes Library XML file path
      -o OUTPUT, --output=OUTPUT
                            Output to file (default=./js/music-data.json)
      -c, --console         Output to console instead of file
      -r RATING, --rating=RATING
                            Minimum rating filter (default = 4)
      -p, --jsonp           Output in JSON-P format
      -i INDENT, --indent=INDENT
                            Indent level for output format (default=None)
      -v, --verbose         Verbose output

