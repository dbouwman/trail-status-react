# Functional Javascript Talk

## WTfunctional?
I thought I was using functions!?!

FP is a set of techniques that can be used to write leaner, more testable code.

- Comes from Math - Category Theory.
- Not new - Lambda Calculus/Alonzo Church 1940s
- You can write Functional JS, because Functions are First Class
  - pass'em in, or return them from fn's
  - higher-order fn's wrangle other fn's

Functional Programming is a Cult. But you can get lots of benefits w/o joining

## Major Ideas
- lots of small functions
  - really. lots. trust me...
- PURE as the driven snow
- But let's cheat - "PURE-ASYNC FNS" because let's face it we're working on the web
- separate code that manipulates data from code that fetches data
- use small fn's w/ our friends MAP and REDUCE
- COMPOSE functions using other functions
  - partial application & currying


## Starting off easy...
map and reduce with simple fn's

Add some handy utils `getProp` and `getPropWithDefault`

Start thinking about separating concerns - fetch data from transforming data from presenting data


## Example App

NoCo Trail status app is map-centric and sloooow to load over 3G.
What's more, we can easily show trail status in a table, which is *much much* faster to load than a whole map

Steps:
- fetch status info from feature service(s)
  - the goal here is super lean app, so we'll just use fetch, but we could use agrjs if we want more comprehensive features such as authentication
- apply transforms:
  - normalize the schemas
  - coalesce records down to individual trails
  - format for display
- hand to React component to render
