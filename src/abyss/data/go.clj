(ns abyss.data.go
  (:require [clj-cctray.core :as parser]
            [abyss.data.events :as events]
            [abyss.data.server :refer [server-type]]))

(defn- select-projects
  [projects select-pattern]
  (if (empty? select-pattern)
    projects
    (let [by-name #(re-matches (re-pattern select-pattern) (:name %))]
      (->> projects
           (filter by-name)))))

(defn- all-projects
  [url]
  (parser/get-projects url {:normalise :all :server (server-type url)}))

(defn- exclude-projects [projects exclude-pattern]
  (if (empty? exclude-pattern)
    projects
    (let [by-name #(re-matches (re-pattern exclude-pattern) (:name %))]
      (->> projects (remove by-name)))))

(defn- interesting-projects [url select-pattern exclude-pattern]
  (-> (all-projects url)
      (select-projects select-pattern)
      (exclude-projects exclude-pattern)))

(defn find-names
  [{:keys [url select exclude]}]
  {:names (->> (interesting-projects url select exclude) (map :name))})

(defn get-filtered-projects
  [{:keys [url select exclude] :as params}]
  (->> (interesting-projects url select exclude)
      (group-by :prognosis)
      (events/add-ui-events params)))