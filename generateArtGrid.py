# A program to generate a JSON file from a folder of artwork.

#!/usr/bin/env python
import sys
import os
import json

def validate_dir(in_dir):
    return_dir = in_dir
    if(return_dir[-1] != '/'):
        return_dir += '/'
    return return_dir

art_dir = ""
output_dir = ""
cut_amount = 0

if len(sys.argv) > 1:
    art_dir = sys.argv[1]
if len(sys.argv) > 2:
    output_dir = sys.argv[2]
if len(sys.argv) > 3:
    cut_amount = int(sys.argv[3])

art_files = []
for (directory_path, directory_names, file_names) in os.walk(art_dir):
    art_files.extend(file_names)
    break

art_object = {
    'art' : [{'id' : 0, 'name' : '0', 'url' : '0'} for k in range(len(art_files))]
}

for art_index in range(len(art_files)):
    art_object['art'][art_index]['id'] = art_index
    art_object['art'][art_index]['name'] = os.path.splitext(art_files[art_index])[0].replace('_', ' ')
    art_object['art'][art_index]['url'] = validate_dir(art_dir[cut_amount:]) + art_files[art_index]

json_file = open(validate_dir(output_dir) + "artworkJSON.js", 'w')
json_file.write("var artwork = " + json.dumps(art_object))
json_file.close()
