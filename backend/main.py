import uuid
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.schemas import (
    Parameters,
    OperationNode,
    OperationNodeCreate,
    SummaryResponse,
    PayloadExample,
)

load_dotenv()

app = FastAPI(
    title="Handicap Pro API",
    description="Backend API for Handicap Pro - Progressive Bankroll Management Dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory state
db_parameters: Parameters = Parameters(
    bankroll=1000.0,
    stake_unit=50.0,
    cycles=10,
    target_return_pct=15.0,
)

db_operation_nodes: List[OperationNode] = [
    OperationNode(
        id=str(uuid.uuid4()),
        day="Mon",
        operation_node="Node Alpha",
        market_type="Handicap",
        invest_cap=50.0,
        exp_return=95.0,
        completed=True,
    ),
    OperationNode(
        id=str(uuid.uuid4()),
        day="Tue",
        operation_node="Node Beta",
        market_type="Over/Under",
        invest_cap=75.0,
        exp_return=142.5,
        completed=False,
    ),
    OperationNode(
        id=str(uuid.uuid4()),
        day="Wed",
        operation_node="Node Gamma",
        market_type="Moneyline",
        invest_cap=100.0,
        exp_return=185.0,
        completed=False,
    ),
]


def calculate_summary() -> SummaryResponse:
    bankroll = db_parameters.bankroll
    target_pct = db_parameters.target_return_pct / 100
    cycles_total = db_parameters.cycles

    ultimate_goal = bankroll * ((1 + target_pct) ** cycles_total)

    completed_nodes = [n for n in db_operation_nodes if n.completed]
    total_invested = sum(n.invest_cap for n in completed_nodes)
    total_returned = sum(n.exp_return for n in completed_nodes)
    net_gain = total_returned - total_invested

    current_balance = bankroll + net_gain

    cycles_completed = sum(
        1
        for i in range(0, len(db_operation_nodes), max(1, len(db_operation_nodes) // cycles_total))
        if all(n.completed for n in db_operation_nodes[i : i + max(1, len(db_operation_nodes) // cycles_total)])
    )
    cycles_completed = min(cycles_completed, cycles_total)
    progress_pct = (cycles_completed / cycles_total) * 100 if cycles_total > 0 else 0

    return SummaryResponse(
        ultimate_goal=round(ultimate_goal, 2),
        current_balance=round(current_balance, 2),
        net_gain_active=round(net_gain, 2),
        cycles_completed=cycles_completed,
        cycles_total=cycles_total,
        progress_pct=round(progress_pct, 1),
    )


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "Handicap Pro API", "version": "1.0.0"}


@app.get("/summary", response_model=SummaryResponse, tags=["Dashboard"])
async def get_summary():
    return calculate_summary()


@app.get("/parameters", response_model=Parameters, tags=["Parameters"])
async def get_parameters():
    return db_parameters


@app.post("/parameters", response_model=Parameters, tags=["Parameters"])
async def update_parameters(params: Parameters):
    global db_parameters
    db_parameters = params
    return db_parameters


@app.get("/operation-nodes", response_model=List[OperationNode], tags=["Operations"])
async def get_operation_nodes():
    return db_operation_nodes


@app.post("/operation-nodes", response_model=OperationNode, tags=["Operations"])
async def create_operation_node(node: OperationNodeCreate):
    new_node = OperationNode(id=str(uuid.uuid4()), **node.model_dump())
    db_operation_nodes.append(new_node)
    return new_node


@app.put("/operation-nodes/{node_id}", response_model=OperationNode, tags=["Operations"])
async def update_operation_node(node_id: str, node: OperationNodeCreate):
    for i, n in enumerate(db_operation_nodes):
        if n.id == node_id:
            updated = OperationNode(id=node_id, **node.model_dump())
            db_operation_nodes[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Operation node not found")


@app.delete("/operation-nodes/{node_id}", tags=["Operations"])
async def delete_operation_node(node_id: str):
    for i, n in enumerate(db_operation_nodes):
        if n.id == node_id:
            db_operation_nodes.pop(i)
            return {"message": "Node deleted successfully"}
    raise HTTPException(status_code=404, detail="Operation node not found")


@app.get("/payload-example", response_model=PayloadExample, tags=["Integration"])
async def get_payload_example():
    summary = calculate_summary()
    return PayloadExample(
        endpoint="/api/v1/bet/analyze",
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer <your-api-key>",
            "X-Client-ID": "handicap-pro-v1",
        },
        body={
            "bankroll": db_parameters.bankroll,
            "stake_unit": db_parameters.stake_unit,
            "cycles": db_parameters.cycles,
            "target_return_pct": db_parameters.target_return_pct,
            "current_balance": summary.current_balance,
            "net_gain": summary.net_gain_active,
            "operation_nodes": len(db_operation_nodes),
            "timestamp": "2026-06-05T19:48:00Z",
        },
    )
