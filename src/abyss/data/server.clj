(ns abyss.data.server)

(defn server-type [url]
  (cond
    (nil? url) nil
    (.contains url "//jenkins") :jenkins
    (.contains url ".ci.cloudbees.com") :jenkins
    (.contains url "//hudson") :hudson
    (.contains url "//travis-ci.org") :travis
    (.contains url "/go/") :go
    (.contains url "//snap-ci.com") :snap
    (.contains url "//circleci.com") :circle
    (.contains url "//teamcity") :team-city
    (.contains url "//cc.rb.") :cruise-control-rb
    (.contains url "//cc.java.") :cruise-control
    (.contains url "//cc.net.") :cruise-control-net
    (.contains url "//api.tddium.com") :solano
    :else :unknown))