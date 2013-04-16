"""
wikilog_gen_json.py by BillSeitz Apr'2013
to generate JSON file usable with http://cgmartin.com/itunes-library-network-graph/
but from WikiLog WikiGraph data stored in WikiGraphSampleRaw.txt
"""
import os

nodes = []
node_ids = {}
next_id = 0
links = []

def input_read(input_file = 'WikiGraphSampleRaw.txt'): # read file of raw WikiGraph mentions
    path = os.getcwd()
    input_full = os.path.join(path, input_file)
    input_lines = open(input_full).readlines()
    return input_lines

def output_write(output_file = 'WikiGraph.json'): # write JSON out to file
    path = os.getcwd()
    output_full = os.path.join(path, 'js', output_file)
    out_f = open(output_full, 'w')
    output = {}
    output['nodes'] = nodes
    output['links'] = links
    out_f.write(str(output))


def node_append(node_name): # add a pagename to nodes if not already there  
    global next_id
    if node_name not in node_ids:
        node_ids[node_name] = next_id
        node = {}
        node['name'] = node_name
        node['id'] = next_id
        if node_name.startswith('z'):
            node['type'] = 'b'
        elif node_name in ('FractallyGenerativePatternLanguage', 'EconomicTransition', 'MakingALiving', 'MeaningfulLife'):
            node['type'] = 'k'
        else:
            node['type'] = 'w'
        next_id = next_id + 1
        nodes.append(node)
        

def links_append(link_fields): # add a link to the links structure
    link = {}
    link['source'] = node_ids[link_fields[0]]
    link['target'] = node_ids[link_fields[1]]
    links.append(link)

def json_create():
    input_lines = input_read()
    for line in input_lines:
        line = line.rstrip('\n')
        print line
        fields = line.split('|')
        node_append(fields[0])
        node_append(fields[1])
        links_append(fields)
    print ('num nodes: %d' % (len(nodes)))
    print ('num links: %d' % (len(links)))
    output_write()
    


if __name__ == '__main__':
    json_create()
    