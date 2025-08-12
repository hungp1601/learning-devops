
variable "region" {
  default = "us-east-1"
}

variable "zone" {
  default = "us-east-1a"
}

variable "amiID" {
  type = map
  default = {
    "us-east-1" = "ami-007855ac798b5d976"
    "us-east-2" = "ami-0f6563ca98377dd91"
  } 
}