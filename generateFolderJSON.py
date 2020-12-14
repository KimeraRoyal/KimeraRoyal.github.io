# A program to generate a JSON file from a folder of files.

#!/usr/bin/env python
import sys
import os
import json

def validate_dir(in_dir):
    return_dir = in_dir
    if(return_dir[-1] != '/'):
        return_dir += '/'
    return return_dir

input_dir = ""
output_dir = ""
output_name = "objectJSON"

if len(sys.argv) > 1:
    input_dir = sys.argv[1]
if len(sys.argv) > 2:
    output_dir = sys.argv[2]
if len(sys.argv) > 3:
    output_name = sys.argv[3]

input_files = []
for (directory_path, directory_names, file_names) in os.walk(input_dir):
    input_files.extend(file_names)
    break

input_object = {
    'objects' : [{'id' : 0, 'name' : '0', 'url' : '0'} for k in range(len(input_files))]
}

for input_index in range(len(input_files)):
    input_object['objects'][input_index]['id'] = input_index
    input_object['objects'][input_index]['name'] = os.path.splitext(input_files[input_index])[0].replace('_', ' ')
    input_object['objects'][input_index]['url'] = validate_dir(input_dir) + input_files[input_index]

json_file = open(validate_dir(output_dir) + output_name + ".js", 'w')
json_file.write("var " + output_name + " = " + json.dumps(input_object))
json_file.close()
