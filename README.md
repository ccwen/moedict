moedict
=======
require https://github.com/ksanaforge/ksana2015

download https://raw.githubusercontent.com/g0v/moedict-data/master/dict-revised.json
and put into ./raw

conversion table, put into ./raw
https://github.com/g0v/moedict-epub/blob/master/sym.txt


generate XML from moedict.json

    node gen
    

generate moedict.kdb from XML
    
    node mkdb
