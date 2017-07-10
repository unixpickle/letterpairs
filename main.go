package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strings"
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
	expr := regexp.MustCompile("^/[a-z]?[a-z]?$")
	if !expr.MatchString(r.URL.Path) {
		s.FileServer.ServeHTTP(w, r)
		return
	}
	data, err := s.dataJSON()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	f, err := s.AssetDir.Open("/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()
	contents, err := ioutil.ReadAll(f)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	filledInBody := strings.Replace(string(contents), "DATA_HERE", string(data), 1)
	w.Write([]byte(filledInBody))
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
	if data, err := s.dataJSON(); err != nil {
		http.Error(w, "failed to read JSON", http.StatusInternalServerError)
		return
	} else {
		w.Write(data)
	}
}

func (s *Server) dataJSON() ([]byte, error) {
	s.saveLock.RLock()
	defer s.saveLock.RUnlock()
	ds, err := ReadDataSet(s.DataFile)
	if err != nil {
		log.Println("read data set:", err)
		ds = DefaultDataSet
	}
	return json.Marshal(ds)
}
