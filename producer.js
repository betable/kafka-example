var kafka = require('kafka-node')
  , zookeeper_nodes = [
        '10.176.128.27:2181'
      , '10.176.128.76:2181'
      , '10.176.128.107:2181'
    ]
  , zookeeper_chroot = '/staging/kafka'
  , client = new kafka.Client(zookeeper_nodes.join(',') + zookeeper_chroot, 'testproducer1')
  , producer = new kafka.Producer(client)
  , partitions = 2
  , topic = 'test'
  , util = require('util')
  , interval
  , num_sent = 0

producer.on('ready', function () {
    client.topicExists([topic], function (errorLength, errors) {
        if (errorLength === 0) {
            //The topic exists, lets move on to getting how many partitions there are
            client.loadMetadataForTopics([topic], function (error, metadata) {
                if (error) {
                    return console.log('Metadata error', error)
                }

                partitions = Object.keys(metadata[1].metadata[topic]).length

                //Now that we know the partition count we can start producing correctly
                //TODO: we should be subscribing to how many partitions there are so we can keep the load balanced
                startProducing()
            })
        } else {
            console.log('The topic "' + topic + '" does not exist')
            console.log('You can create it by using the `kafka-create-topic.sh` tool located in /usr/share/kafka/bin on nextkafka01')
            process.exit(1)
        }
    })
})

function startProducing () {
    interval = setInterval(function () {
        producer.send([
            { topic: 'test', messages: [ 'Test message: ' + num_sent++ ], partition: num_sent % partitions }
        ], function (error, topics) {
            if (error) {
                console.log('Produce error', error)
                process.exit(1)
            }

            Object.keys(topics[topic]).forEach(function (partition) {
                console.log('Added message to ' + topic + ' topic on partition ' + partition + ', the last offset is currently ' + topics[topic][partition])
            })

        })
    }, 1000)
}