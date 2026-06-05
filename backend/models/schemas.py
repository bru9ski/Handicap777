from pydantic import BaseModel
from typing import Optional
from enum import Enum


class MarketType(str, Enum):
    handicap = "Handicap"
    over_under = "Over/Under"
    both_teams_score = "Both Teams Score"
    moneyline = "Moneyline"
    double_chance = "Double Chance"


class Parameters(BaseModel):
    bankroll: float = 1000.0
    stake_unit: float = 50.0
    cycles: int = 10
    target_return_pct: float = 15.0


class OperationNode(BaseModel):
    id: Optional[str] = None
    day: str
    operation_node: str
    market_type: MarketType
    invest_cap: float
    exp_return: float
    completed: bool = False


class OperationNodeCreate(BaseModel):
    day: str
    operation_node: str
    market_type: MarketType
    invest_cap: float
    exp_return: float
    completed: bool = False


class SummaryResponse(BaseModel):
    ultimate_goal: float
    current_balance: float
    net_gain_active: float
    cycles_completed: int
    cycles_total: int
    progress_pct: float


class PayloadExample(BaseModel):
    endpoint: str
    method: str
    headers: dict
    body: dict
