## About

Simple kafka producer/consumer in nodejs. The producer code is a good starting point for producers but the consumer
is no where near ready.

## Producer

The producer is a simple script that inserts messages into the `test` topic, which must exist before running.
It will balance inserting messages into however many partitions are configured by doing a modulus on the current message
number.

    node producer

## Consumer

The consumer is a hardly working piece of code. It will fetch messages from kafka but will not store the highest offset
achieved anywhere. Each time you start the consumer it will start from offset 0. If the consumer reaches the end of the
queue it will likely error and die. It currently will only consume from partition 0

    node consumer