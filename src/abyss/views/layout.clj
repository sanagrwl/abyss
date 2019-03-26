(ns abyss.views.layout
  (:use [hiccup.core]))

(defn- head [title]
  [:head
   [:meta {:http-equiv "Content-type" :content "text/html; charset=utf-8"}]
   [:meta {:name "viewport" :content "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"}]

   [:title title]

   [:link {:rel "stylesheet" :type "text/css" :href "/css/base.css"}]])

(defn view-layout [title & content]
  (html
    (head title)
    [:body content]))
