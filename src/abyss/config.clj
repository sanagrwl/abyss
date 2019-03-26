(ns abyss.config
  (:require [clojure.data.json :refer [read-str]]
            [clojure.java.io :refer [as-file]]
            [abyss.media :as media]))

(def config-file "resources/config/config.json")
(def default-breaking-build-sound (media/normalize-name "wario_ah_hahaha_wonderful.wav"));
(def default-success-from-broken-build-sound (media/normalize-name "mario_woo_hoo.wav"));

(def ^:private -config (atom {}))

(defn- config-attr [attr]
  (attr @-config))

(defn- config-file-exists? []
  (.exists (as-file config-file)))

(defn- reset-config [new-val]
  (reset! -config new-val))

(defn config-from-file []
  (when (config-file-exists?)
    (-> config-file
        slurp
        (read-str :key-fn keyword)
        reset-config)))

(defn- override [attr-key params-key-to-override params]
  (if-let [attr-val (config-attr attr-key)]
    (assoc params params-key-to-override attr-val)
    params))

(def override-url (partial override :cctray-url :url))
(def override-red-alert-threshold (partial override :red-alert-threshold :red-alert-threshold))
(def override-glitch-effect-threshold (partial override :glitch-effect-threshold :glitch-effect-threshold))

(defn override-config-data [params]
  (-> params
      override-url
      override-red-alert-threshold
      override-glitch-effect-threshold))