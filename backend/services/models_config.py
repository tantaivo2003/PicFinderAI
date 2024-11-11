import json
from ruamel.yaml import YAML
import argparse
import torch

# Định nghĩa các cấu hình và model
def load_config():
    INDEX_PATH = "database/image_embeds.bin"
    IMAGE_PATHS = "database/image_paths.json"
    CHECKPOINT_PATH = "1b_convnext_base_laion_2b_79629.th"
    CONFIGS = "./configs/finetune/cuhk_pedes_ckc_mm_mlm.yaml"
    OUTPUT_DIR = "outputs/response"

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    parser = argparse.ArgumentParser()
    parser.add_argument('--checkpoint', type=str, default=CHECKPOINT_PATH)
    parser.add_argument('--config', type=str, default=CONFIGS)
    parser.add_argument('--output_dir', type=str, default=OUTPUT_DIR)
    parser.add_argument('--evaluate', action='store_true', default=True)
    parser.add_argument('--override_cfg', default="", type=str, help="Use ; to separate keys")
    args, _ = parser.parse_known_args()

    yaml = YAML(typ='safe')
    with open(args.config, 'r') as file:
        config = yaml.load(file)

    # Update config if needed
    # utils.update_config(config, args.override_cfg)
    # if utils.is_main_process():
    #     print('config:', json.dumps(config))

    return config, args, device
