(defproject abyss "1.0.0"  
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.5"]
                 [hiccup "1.0.4"]
                 [clj-cctray "0.8.0"]
                 [ring/ring-json "0.3.1"]
                 [org.clojure/data.json "0.2.5"]]

  :profiles {
    :dev {:dependencies [[midje "1.6.3"]]
                   :plugins [[lein-midje "3.1.3"]]}
    :uberjar{ 
      :aot :all
      :main abyss.app
    }
  }

  :plugins [[lein-ring "0.8.7"]
            [lein-idea "1.0.1"]]

  :aliases {"test" ["midje"]}

  :ring {:handler abyss.app/app})

