import AmazonS3URI from 'amazon-s3-uri'

export type S3ParsedUrl = {
  bucket: string
  key: string
}

interface S3UrlParser {
  parse(url: string): S3ParsedUrl
}

class ProductionS3UrlParser implements S3UrlParser {
  parse(url: string): S3ParsedUrl {
    return AmazonS3URI(url)
  }
}

class LocalS3UrlParser implements S3UrlParser {
  parse(url: string): S3ParsedUrl {
    const parts = url.split('/').reverse()
    return {
      bucket: parts[1],
      key: parts[0],
    }
  }
}

export default function (stage: string): S3UrlParser {
  return stage === 'production'
    ? new ProductionS3UrlParser()
    : new LocalS3UrlParser()
}
