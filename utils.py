import urllib2
import json


class Utils:

    def __init__(self):
        pass


    #send a basic message
    def getInstagramImageFromUsername(self,username):

        response = urllib2.urlopen('https://www.instagram.com/'+username+'/?__a=1')
        data = json.load(response)
        return data['user']['profile_pic_url_hd']


    def instagramUsernameExists(self,username):

        try:
            resp = urllib2.urlopen('https://www.instagram.com/'+username+'/?__a=1')
        except urllib2.HTTPError as e:
            if e.code == 404:
                return False
            else:
                return False
        except urllib2.URLError as e:
            # Not an HTTP-specific error (e.g. connection refused)
            return False
        else:
            # 200
            return True
