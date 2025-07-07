#this script builds the index.ts file for the ribbons folder
import os

#for each folder in the current directory
#for each file in the folder

#write the line "import ribbon{folder_name}_{file_index} from './{folder_name}/{file_name}'"
def build_index():
    current_directory = os.getcwd()
    index_file_path = os.path.join(current_directory, 'index.ts')

    export_lists = []

    with open(index_file_path, 'w') as index_file:
        for folder_name in os.listdir(current_directory):
            folder_path = os.path.join(current_directory, folder_name)
            if os.path.isdir(folder_path):
                index_file.write(f"// Ribbons from folder: {folder_name}\n")
                export_list = [folder_name]
                for file_index, file_name in enumerate(os.listdir(folder_path)):
                    if file_name.endswith('.png'):
                        export_name = f"ribbon_{folder_name}_{file_index}"
                        import_line = f"import {export_name} from './{folder_name}/{file_name}'\n"
                        export_list.append(export_name)
                        index_file.write(import_line)

            export_lists.append(export_list)

        # Write the export statements at the end of the index.ts file
        index_file.write("\n// Export statements\n")
        for export_list in export_lists:
            index_file.write(f"export const {export_list[0]} = [{', '.join(export_list[1:])}];\n")


if __name__ == "__main__":
    build_index()
    print("index.ts file has been built successfully.")
    print("You can now import the ribbons using the export statements in index.ts.")