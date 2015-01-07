import os


def deepupdate(source, destination):
    for k, v in source.items():
        if isinstance(v, dict):
            if k in destination:
                deepupdate(source[k], destination[k])
            else:
                destination[k] = v
        else:
            destination[k] = v


def list_subdirectories(dirpath):
    for subdirname in os.listdir(dirpath):
        subdirpath = os.path.join(dirpath, subdirname)
        if os.path.isdir(subdirpath):
            yield subdirname, subdirpath


def list_files(dirpath):
    for filename in os.listdir(dirpath):
        filepath = os.path.join(dirpath, filename)
        if os.path.isfile(filepath):
            filename, extension = os.path.splitext(filename)
            yield filename, extension.replace('.', ''), filepath
