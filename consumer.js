var kafka = require('kafka-node')
  , zookeeper_nodes = [
        '10.176.128.27:2181'
      , '10.176.128.76:2181'
      , '10.176.128.107:2181'
    ]
  , zookeeper_chroot = '/staging/kafka'
  , topic = 'test'
  , client = new kafka.Client(zookeeper_nodes.join(',') + zookeeper_chroot, 'testconsumer1')
  , consumer = new kafka.Consumer(
        client
      , [ { topic: 'test', partition: 0 } ]
      , { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024, fromOffset: true }
    )

consumer.on('message', function (message) {
    console.log('message', '"' + message.value + '"', 'Offset:', message.offset)
})