/* ========================================================================
* Phonon: filesystem.js v0.0.4
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window, document) {

    'use strict';

    if(!window.localStorage) {
        throw new Error('localStorage is not supported on this browser');
    }

    var isCordova = typeof window.cordova !== 'undefined' ? true : false;
    var _FS = null;


    /**
     * Create the sub directories
     * @param {String} : path
     * @param {Function} : success
    */
    function createDirectory(path, success){
        var dirs = path.split("/").reverse();
        var root = _FS.root;

        var createDir = function(dir){
            dir = dir.replace('//', '').replace('/', '');
            console.log("create dir " + dir);
            root.getDirectory(dir, {
                create : true,
                exclusive : false
            }, successCB, failCB);
        };

        var successCB = function(entry){
            console.log("dir created " + entry.fullPath);
            root = entry;
            if(dirs.length > 0){
                createDir(dirs.pop());
            }else{
                console.log("all dir created");
                success(entry);
            }
        };

        var failCB = function(){
            console.log("failed to create dir");
        };

        createDir(dirs.pop());
    }


    var _DirectoryEntry = (function () {

        function _DirectoryEntry(name) {
            this.isFile = false;
            this.isDirectory = true;
            this.name = name;
            this.fullPath = null;
            this.filesystem = null;
        }
        _DirectoryEntry.prototype.getMetadata = function () {

        };
        _DirectoryEntry.prototype.moveTo = function () {

        };
        _DirectoryEntry.prototype.copyTo = function () {

        };
        _DirectoryEntry.prototype.toURI = function () {

        };
        _DirectoryEntry.prototype.remove = function () {

        };
        _DirectoryEntry.prototype.getParent = function () {

        };
        _DirectoryEntry.prototype.createReader = function () {

        };
        _DirectoryEntry.prototype.getDirectory = function () {

        };
        _DirectoryEntry.prototype.getFile = function () {

        };
        _DirectoryEntry.prototype.removeRecursively = function () {

        };

        return _DirectoryEntry;
    })();

    var _FileEntry = (function () {

        function _FileEntry(name) {
            this.isFile = true;
            this.isDirectory = false;
            this.name = name;
            this.fullPath = null;
            this.filesystem = null;
        }
        _FileEntry.prototype.getMetadata = function () {

        };
        _FileEntry.prototype.moveTo = function () {

        };
        _FileEntry.prototype.copyTo = function () {

        };
        _FileEntry.prototype.toURI = function () {

        };
        _FileEntry.prototype.remove = function () {

        };
        _FileEntry.prototype.getParent = function () {

        };
        _FileEntry.prototype.createWriter = function () {

        };
        _FileEntry.prototype.file = function (callback) {
            callback({name:this.name, fullPath: this.fullPath, type:null, lastModifiedDate:null, size:0});
        };

        return _FileEntry;
    })();

    var _FileReader = (function () {

        function _FileReader(name) {
            this.readyState = true;
            this.result = false;
            this.error = 0;
            this.onloadstart = null;
            this.onprogress = null;
            this.onload = null;
            this.onabort = null;
            this.onerror = null;
            this.onloadend = null;
        }
        _FileReader.prototype.abort = function () {

        };
        _FileReader.prototype.readAsDataURL = function () {

        };
        _FileReader.prototype.readAsText = function (file) {
            var storage = window.localStorage.getItem(file.name);
            storage = (storage === null ? '' : storage);
            var evt = {target: {result:storage}};
            this.onloadend(evt);
        };

        return _FileReader;
    })();  

    /**
     * Public API
    */
    var api = {};
    
    /**
     * Get the _DirectoryEntry Object
     *
     * @param {String} : directoryName
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function getDirectory(directoryName, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        if(isCordova) {
            try {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    _FS = fileSystem;

                    fileSystem.root.getDirectory(directoryName, { create: false }, function(dirEntry) {
                        successCallback(dirEntry);
                    }, function() {
                        createDirectory(directoryName, function(dirEntry) {
                            successCallback(dirEntry);
                        });
                    });
                }, null);
            }
            catch(e) {
                if(typeof errorCallback === 'function')
                    errorCallback();
            }
        } else {
            successCallback(new _DirectoryEntry(directoryName));
        }
    }
    api.getDirectory = getDirectory;

    /**
     * Get the FileEntry Object
     *
     * @param {String} : directoryName
     * @param {String} : filename
     * @param {Boolean} createFile
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function getFile(directoryName, filename, createFile, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof filename !== 'string') {
            throw new TypeError('filename must be a string');
        }
        if(typeof createFile !== 'boolean') {
            throw new TypeError('createFile must be a boolean');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        if(isCordova) {
            if(directoryName === null) {
                _FS.root.getFile(filename, {create: createFile, exclusive: false}, successCallback, errorCallback);
            } else {
                getDirectory(directoryName, function(dirEntry) {
                    dirEntry.getFile(filename, {create: createFile, exclusive: false}, successCallback, errorCallback);
                }, errorCallback);
            }
        } else {

            var storage = window.localStorage.getItem(directoryName+filename);
            if(createFile) {
                successCallback(new _FileEntry(directoryName+filename));
            } else {
                if(storage === null) {
                    if(typeof errorCallback === 'function')
                        errorCallback('NOT_FOUND_ERR');
                } else {
                    successCallback(new _FileEntry(directoryName+filename));
                }
            }
        }
    }
    api.getFile = getFile;

    /**
     * Read a file's content
     * @param {String} : directoryName
     * @param {String} : filename
     * @param {Boolean} : createFile
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function readFile(directoryName, filename, createFile, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof filename !== 'string') {
            throw new TypeError('filename must be a string');
        }
        if(typeof createFile !== 'boolean') {
            throw new TypeError('createFile must be a boolean');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        getFile(directoryName, filename, createFile, function(fileEntry) {

            fileEntry.file(function(file) {

                var reader = (isCordova ? new FileReader() : new _FileReader());
                reader.onloadend = function(event) {

                    var data = event.target.result;
                    data = (data === '' ? null : data);

                    try {
                        data = JSON.parse(data);
                    } catch(e) {
                        data = null;
                    }
                    successCallback(data);
                };
                reader.readAsText(file);

            }, function(error) {
                if(typeof errorCallback === 'function')
                    errorCallback(error);
            });
        }, function() {
            if(typeof errorCallback === 'function')
                errorCallback(null);
        });      
    }
    api.readFile = readFile;

    /**
     * Check if the file exists
     *
     * @param {String} : directoryName
     * @param {String} : filename
     * @param {Function} : existCallback
     * @param {Function} : notExistCallback
    */
    function fileExists(directoryName, filename, existCallback, notExistCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof filename !== 'string') {
            throw new TypeError('filename must be a string');
        }
        if(typeof existCallback !== 'function') {
            throw new TypeError('existCallback must be a existCallback function');
        }
        if(typeof notExistCallback !== 'function') {
            throw new TypeError('notExistCallback must be a notExistCallback function');
        }

        readFile(directoryName, filename, false, function() {
            existCallback(true);
        }, function() {
            notExistCallback(false);
        });
    }
    api.fileExists = fileExists;

    /**
     * Write a file's content
     *
     * @param {String} : directoryName
     * @param {String} : filename
     * @param {Boolean} : createFile
     * @param {Object} : content
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function putContent(directoryName, filename, createFile, content, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof filename !== 'string') {
            throw new TypeError('filename must be a string');
        }
        if(typeof createFile !== 'boolean') {
            throw new TypeError('createFile must be a boolean');
        }
        if(typeof content !== 'object') {
            throw new TypeError('content must be a JSON object');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        content = JSON.stringify(content);

        getFile(directoryName, filename, createFile, function(fileEntry) {

            if(isCordova) {
                fileEntry.createWriter(function(writer) {
                    writer.write(content);
                    successCallback({status:'success'});
                }, function() {
                    if(typeof errorCallback === 'function')
                        errorCallback({status:'error',message:'INVALID_MODIFICATION_ERR'});
                });
            } else {
                window.localStorage.setItem(directoryName+filename, content);
                successCallback({status:'success'});
            }
            
        }, function() {
            if(typeof errorCallback === 'function')
                errorCallback({status:'error',message:'NOT_FOUND_ERR'});
        });
    }
    api.putContent = putContent;

    /**
     * Delete a file
     *
     * @param {String} directoryName : directory name (String)
     * @param {String} filename
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function deleteFile(directoryName, filename, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof filename !== 'string') {
            throw new TypeError('filename must be a string');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        getFile(directoryName, filename, false, function(fileEntry) {

            if(isCordova) {
                fileEntry.remove(function() {
                    successCallback({status:'success'});
                }, function(e) {
                    if(typeof errorCallback === 'function')
                        errorCallback({status:'error',message:e});
                });
            } else {
                window.localStorage.setItem(directoryName+filename, null);
                successCallback({status:'success'});
            }
        }, function() {
            if(typeof errorCallback === 'function')
                errorCallback({status:'error', message:'file_not_exist'});
        });
    }
    api.deleteFile = deleteFile;

    /**
     * Rename a file
     *
     * @param {String} directoryName
     * @param {String} oldFilename
     * @param {String} newFilename
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function renameFile(directoryName, oldFilename, newFilename, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof oldFilename !== 'string') {
            throw new TypeError('oldFilename must be a string');
        }
        if(typeof newFilename !== 'string') {
            throw new TypeError('newFilename must be a string');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        getFile(directoryName, oldFilename, false, function(fileEntry) {

            if(isCordova) {
                getDirectory(directoryName, function(dirEntry) {
                    fileEntry.moveTo(dirEntry, newFilename, function() {
                        successCallback({status:'success'});
                    }, function() {
                        if(typeof errorCallback === 'function')
                            errorCallback({status: 'error', message: 'move_error'});
                    });
                }, function(error) {
                    if(typeof errorCallback === 'function')
                        errorCallback(error);
                });
            } else {
                readFile(directoryName, oldFilename, false, function(data) {
                    deleteFile(directoryName, oldFilename, function() {
                        putContent(directoryName, newFilename, data, function() {
                            successCallback({status:'success'});
                        }, function(error) {
                            if(typeof errorCallback === 'function')
                                errorCallback(error);
                        });
                    }, function(error) {
                        if(typeof errorCallback === 'function')
                            errorCallback(error);
                    });
                }, function(error) {
                    if(typeof errorCallback === 'function')
                        errorCallback(error);
                });
            }
        }, function(error) {
            if(typeof errorCallback === 'function')
                errorCallback(error);
        });
    }
    api.renameFile = renameFile;

    /**
     * Move files in another directory
     *
     * @param {String} : directoryName
     * @param {String} : newDirectoryName
     * @param {Boolean} : fileOnly
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function moveEntries(directoryName, newDirectoryName, fileOnly, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof newDirectoryName !== 'string') {
            throw new TypeError('newDirectoryName must be a string');
        }
        if(typeof fileOnly !== 'boolean') {
            throw new TypeError('fileOnly must be a boolean');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        getDirectory(directoryName, function(dirEntry) {
            getDirectory(newDirectoryName, function(newDirEntry) {

                if(isCordova) {
                    var directoryReader = dirEntry.createReader();
                    directoryReader.readEntries(function(entries) {

                        var l = entries.length - 1, i = l;
                        for (; i >= 0; i--) {
                            var fileEntry = entries[i];

                            if(fileOnly) {
                                if(fileEntry.isFile) {
                                    fileEntry.moveTo(newDirEntry, fileEntry.name, null, null);
                                }
                            } else {
                                fileEntry.moveTo(newDirEntry, fileEntry.name, null, null);
                            }
                        }
                        successCallback({status:'success'});
                    }, function(error) {
                        if(typeof errorCallback === 'function')
                            errorCallback({status:'error', message: error.code});
                    });
                } else {
                    readFile(directoryName, newDirectoryName, false, function(data) {
                        deleteFile(directoryName, newDirectoryName, function() {
                            putContent(directoryName, newDirectoryName, false, data, function() {
                                successCallback({status:'success'});
                            });
                        });
                    }, function(error) {
                        if(typeof errorCallback === 'function')
                            errorCallback(error);
                    });
                }
            }, function(error) {
                if(typeof errorCallback === 'function')
                    errorCallback(error);
                    });
        }, function(error) {
            if(typeof errorCallback === 'function')
                errorCallback(error);
        });
    }
    api.moveEntries = moveEntries;

    /**
     * Delete all the files from a directory
     * @param {String} : directoryName
     * @param {Function} : successCallback
     * @param {Function} : errorCallback
    */
    function removeRecursively(directoryName, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        getDirectory(directoryName, function(entry) {

            if(isCordova) {
                entry.removeRecursively(function() {
                    successCallback({status:'success'});
                }, function() {
                    if(typeof errorCallback === 'function')
                        errorCallback({status:'error',message:'directory_not_found'});
                });
            } else {
                var l = localStorage.length - 1, i = l;
                for (; i >= 0; i--) {
                    var key = localStorage.key(i);
                    if(key.indexOf(directoryName) === 0)
                        window.localStorage.removeItem(key);
                }
                successCallback({status:'success'});
            }
        }, function(error) {
            if(typeof errorCallback === 'function')
                errorCallback(error);
        });
    }
    api.removeRecursively = removeRecursively;

    function deleteDirectory(directoryName, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }

        removeRecursively(directoryName, function() {
            getDirectory(directoryName, function(dirEntry) {
                dirEntry.remove(function() {
                    successCallback({status: 'success'});
                }, function(error) {
                    if(typeof errorCallback === 'function')
                        errorCallback({status: 'error', message: error.code});
                });
            }, function(error) {
                if(typeof errorCallback === 'function')
                    errorCallback({status: 'error', message: error.code});
            });
        }, function(error) {
            if(typeof errorCallback === 'function')
                errorCallback({status: 'error', message: error.code});
        });
    }
    api.deleteDirectory = deleteDirectory;

    /**
     * Rename a directory based on a hack, avoiding the following error
     * org.apache.cordova.file.InvalidModificationException: Can't move itself into itself
     *
     *
    */
    function renameDirectory(directoryName, newDirectoryName, successCallback, errorCallback) {

        if(typeof directoryName !== 'string') {
            throw new TypeError('directoryName must be a string');
        }
        if(typeof newDirectoryName !== 'string') {
            throw new TypeError('newDirectoryName must be a string');
        }
        if(typeof successCallback !== 'function') {
            throw new TypeError('successCallback must be a successCallback function');
        }


        if(directoryName.indexOf('/', directoryName.length - '/'.length) !== -1) {
            directoryName = directoryName.substring(0, directoryName.lastIndexOf('/'));
        }
        var parentDirectory = directoryName.substring(0, directoryName.lastIndexOf('/'));

        /*
        console.log('directoryName: ' + directoryName);
        console.log('parentDirectory: ' + parentDirectory);
        console.log('to -> ' + parentDirectory + '/' + newDirectoryName);
        */
        moveEntries(directoryName, parentDirectory + '/' + newDirectoryName, false, function() {
            deleteDirectory(directoryName, function() {
                successCallback({status: 'success'});
            }, function(error) {
                if(typeof errorCallback === 'function')
                    errorCallback({status: 'error', message: error.code});
            });
        }, function(error) {
            if(typeof errorCallback === 'function')
                errorCallback({status: 'error', message: error.code});
        });
    }
    api.renameDirectory = renameDirectory;

    // Expose the Router either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return api;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        if(window.Phonon === undefined) {
            window.Phonon = {};
        }
        window.Phonon.FileSystem = api;
    }

}(window, document));