import graphene
import game.schema

class Query(game.schema.Query, graphene.ObjectType):
    # This class will inherit from multiple Queries from all apps in project
    pass

schema = graphene.Schema(query=Query)