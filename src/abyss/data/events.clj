(ns abyss.data.events)

(def count-builds (partial apply +))
(def remove-nils (partial remove nil?))

(defn- count-build-types [build-type grouped-pipelines]
  (-> grouped-pipelines
      (get build-type)
      count))

(def sick-building-count (partial count-build-types :sick-building))
(def sick-count (partial count-build-types :sick))
(def sick-and-sick-building-count (comp count-builds remove-nils (juxt sick-count sick-building-count)))

(def events {:clouds         [sick-and-sick-building-count 1 :no-override]
             :night          [sick-and-sick-building-count 2 :no-override]
             :rain           [sick-and-sick-building-count 2 :no-override]
             :snow           [sick-and-sick-building-count 3 :no-override]
             :blizzard       [sick-and-sick-building-count 4 :no-override]
             :red-alert      [sick-count 5 :red-alert-threshold]
             :glitch         [sick-count 6 :glitch-effect-threshold]})

(defn default-threshold-for [event]
  (-> (event events) second))

(defn- over-threshold?
  [default-threshold threshold count]
  (> (inc count) (or threshold default-threshold) 0))

(defn- count-builds-for-event
  [override-thresholds grouped-pipelines [event [count-fn default-threshold override-threshold-key]]]
  (let [override-threshold (override-threshold-key override-thresholds)
        over-threshold-fn (comp (partial over-threshold? default-threshold override-threshold)
                                count-fn)]
    [event (over-threshold-fn grouped-pipelines)]))

(defn- priortize-events
  [{:keys [snow] :as events}]
  (if snow
    (assoc events :rain false)
    events))

(defn calculate-events [override-thresholds grouped-pipelines]
  (->> events
       (map (partial count-builds-for-event override-thresholds grouped-pipelines))
       (into {})
       priortize-events))

(defn add-ui-events [override-thresholds grouped-pipelines]
  (merge grouped-pipelines
         (calculate-events override-thresholds grouped-pipelines)))