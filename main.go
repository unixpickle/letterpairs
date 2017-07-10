package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"sync"
)

type Server struct {
	AssetDir   http.Dir
	FileServer http.Handler
	DataFile   string

	saveLock sync.RWMutex
}

func main() {
	var listenAddr string
	var server Server
	var assetDir string
	flag.StringVar(&server.DataFile, "data", "data.json", "place to store changes")
	flag.StringVar(&assetDir, "assets", "assets", "web asset directory")
	flag.StringVar(&listenAddr, "addr", ":8082", "listen address")

	flag.Parse()

	server.AssetDir = http.Dir(assetDir)
	server.FileServer = http.FileServer(server.AssetDir)

	http.HandleFunc("/", server.HandleRoot)
	http.HandleFunc("/update", server.HandleUpdate)
	http.HandleFunc("/params", server.HandleParams)
	http.ListenAndServe(listenAddr, nil)
}

func (s *Server) HandleRoot(w http.ResponseWriter, r *http.Request) {
	expr := regexp.MustCompile("^/[a-z][a-z]?$")
	if expr.MatchString(r.URL.Path) {
		f, err := s.AssetDir.Open("/index.html")
		if err == nil {
			defer f.Close()
			stats, err := f.Stat()
			if err == nil {
				http.ServeContent(w, r, "index.html", stats.ModTime(), f)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		s.FileServer.ServeHTTP(w, r)
	}
}

func (s *Server) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	s.saveLock.Lock()
	defer s.saveLock.Unlock()
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return
	}
	var ds DataSet
	if err := json.Unmarshal(data, &ds); err != nil {
		w.Write([]byte(`{"error": "bad JSON data"}`))
		return
	}
	ds.Write(s.DataFile)
	w.Write([]byte(`{"success": true}`))
}

func (s *Server) HandleParams(w http.ResponseWriter, r *http.Request) {
	s.saveLock.RLock()
	defer s.saveLock.RUnlock()
	ds, err := ReadDataSet(s.DataFile)
	if err != nil {
		log.Println("read data set:", err)
		ds = DefaultDataSet
	}
	data, _ := json.Marshal(ds)
	w.Write(data)
}
