(ns abyss.app
  (:require [compojure.handler :as handler]
            [compojure.route :as route]
            [abyss.data.go :as go]
            [abyss.config :as config]
            [abyss.views.index :as index-page]
            [cheshire.core :refer [generate-string]]
            [cheshire.generate :as cheshire]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [abyss.media :as media])
  (:use [compojure.core])
  (import org.joda.time.DateTime)
  (:gen-class))

(cheshire/add-encoder DateTime (fn [date json-generator]
                                 (.writeString json-generator (.toString date))))

(defn- as-json-response [body]
  {:body         (generate-string body)
   :headers      {"Access-Control-Allow-Origin" "*"
                  "content-type" "application/json"}})

(defn- convert-to-number [p params]
  (if-let [v (p params)]
    (assoc params p (read-string v))
    params))

(defroutes main-routes
  (GET "/" []
       (index-page/contents))

  (GET "/pipelines" {params :params}
       (->> params
           (convert-to-number :red-alert-threshold)
           (convert-to-number :glitch-effect-threshold)
           config/override-config-data
           go/get-filtered-projects
           as-json-response))

  (GET "/filternames" {params :params}
       (-> params
           config/override-url
           go/find-names
           as-json-response))

  (route/resources "/"))

(def app
  (-> main-routes
      handler/api
      (wrap-file media/sounds-dir))
  )

(defn -main [& args]
  (run-jetty app {:port (Integer/valueOf (or (System/getenv "port") "8080"))}))
