import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from core.vector_store import build_vector_store, load_vector_store, get_retriever

def get_llm():
    return ChatGroq(model='openai/gpt-oss-120b',temperature=0.4,groq_api_key=os.getenv("GROQ_API_KEY"))


def format_docs(docs):
    return "\n\n".join([doc.page_content for doc in docs])

# NOTE (API integration): `collection_name` is an ADDITIVE optional parameter,
# defaulting to None (original behavior, single shared collection). The FastAPI
# layer passes a unique collection name per session_id so each processed
# video/meeting gets its own isolated retrieval context instead of sharing one
# persisted Chroma collection across every session.
def build_rag_chain(transcript:str, collection_name: str = None):

    vector_store = build_vector_store(transcript, collection_name=collection_name)

    retriever = get_retriever(vector_store, k = 4)

    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(

        [(
            "system",
            """You are an expert meeting assistant. Answer the user's question 
based ONLY on the meeting transcript context provided below.

If the answer is not found in the context, say: 
"I could not find this information in the meeting transcript."

Always be concise and precise. If quoting someone, mention it clearly.

Context from meeting transcript:
{context}""",
        ),
        ("human", "{question}"),
    ]
    )

    #full LCEL Rag pipeline 

    rag_chain = (

        {"context" : retriever | RunnableLambda(format_docs),
         "question": RunnablePassthrough()
         }
         |prompt|llm|StrOutputParser()
    )

    return rag_chain


def load_rag_chain(collection_name: str = None):
    vector_store = load_vector_store(collection_name=collection_name)
    retriver = get_retriever(vector_store)

    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """You are an expert meeting assistant. Answer the user's question 
based ONLY on the meeting transcript context provided below.

If the answer is not found in the context, say: 
"I could not find this information in the meeting transcript."

Always be concise and precise. If quoting someone, mention it clearly.

Context from meeting transcript:
{context}""",
        ),
        ("human", "{question}"),
    ])

    rag_chain = (
        {
            "context":  retriver| RunnableLambda(format_docs),
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain


def ask_question(rag_chain, question:str) -> str:
    print(f"Question : {question}")
    answer = rag_chain.invoke(question)
    print(f"answer :{answer}")
    return answer
